
/**
 * Supabase to Google Sheets Integration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet with the following worksheets:
 *    - "Remix Suggestions"
 *    - "Contact Submissions"
 *    - "Connection Requests" 
 *    - "Story Likes"
 *    - "Story Submissions"
 * 2. In Google Sheets, go to Extensions > Apps Script
 * 3. Copy this entire code into the Apps Script editor
 * 4. Replace the SUPABASE_URL and SUPABASE_SERVICE_KEY with your actual values
 * 5. Save the project and run setup() function once to create triggers
 * 6. Authorize the necessary permissions when prompted
 */

// Configuration - Replace these with your actual Supabase details
const SUPABASE_URL = 'https://mqwvbvjwfmhhkqxdbuqh.supabase.co';
const SUPABASE_SERVICE_KEY = 'YOUR_SUPABASE_SERVICE_KEY'; // Replace with your service key (not anon key)

// Sheet names
const SHEETS = {
  REMIX: 'Remix Suggestions',
  CONTACTS: 'Contact Submissions',
  CONNECTIONS: 'Connection Requests',
  LIKES: 'Story Likes',
  SUBMISSIONS: 'Story Submissions'
};

/**
 * Creates menu items when the spreadsheet opens
 */
function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu('Supabase', [
    {name: 'Update All Data', functionName: 'updateAllSheets'},
    {name: 'Setup Daily Updates', functionName: 'setupDailyTrigger'}
  ]);
}

/**
 * Initial setup function - Run once to set up triggers
 */
function setup() {
  setupDailyTrigger();
  // Run once to populate initial data
  updateAllSheets();
}

/**
 * Sets up a daily trigger to update all sheets
 */
function setupDailyTrigger() {
  // Delete any existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'updateAllSheets') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  // Create new trigger to run daily
  ScriptApp.newTrigger('updateAllSheets')
    .timeBased()
    .everyDays(1)
    .atHour(1) // 1 AM in the timezone of the Google Sheet
    .create();
    
  Logger.log('Daily trigger has been set up to update sheets at 1 AM daily.');
}

/**
 * Updates all sheets with the latest data
 */
function updateAllSheets() {
  try {
    fetchRemixSuggestions();
    fetchContactSubmissions();
    fetchConnectionRequests();
    fetchStoriesWithLikes();
    fetchStorySubmissions();
    
    // Add timestamp of last update
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Summary');
    if (!sheet) {
      const summarySheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Summary');
      summarySheet.getRange('A1:B1').setValues([['Last Updated', new Date().toString()]]);
    } else {
      sheet.getRange('A1:B1').setValues([['Last Updated', new Date().toString()]]);
    }
    
    Logger.log('All sheets updated successfully');
  } catch (error) {
    Logger.log('Error updating sheets: ' + error.toString());
  }
}

/**
 * Fetches remix suggestions and updates the sheet
 */
function fetchRemixSuggestions() {
  const data = fetchFromSupabase('remix_suggestions?select=id,remix_text,created_at,story_id,stories(title,description,category)');
  
  if (!data || data.length === 0) {
    Logger.log('No remix suggestions found');
    return;
  }
  
  const sheet = getOrCreateSheet(SHEETS.REMIX);
  
  // Clear existing data except headers
  clearSheetKeepingHeaders(sheet);
  
  // Set headers if they don't exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Story Title', 'Story Category', 'Remix Suggestion', 'Created At']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
  
  // Format data for the sheet
  const rows = data.map(item => [
    item.id,
    item.stories?.title || 'Unknown',
    item.stories?.category || 'Unknown',
    item.remix_text,
    new Date(item.created_at).toString()
  ]);
  
  // Append rows to the sheet
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 5).setValues(rows);
  }
  
  Logger.log(`Updated ${rows.length} remix suggestions`);
}

/**
 * Fetches contact submissions (join community) and updates the sheet
 */
function fetchContactSubmissions() {
  const data = fetchFromSupabase('contact_submissions');
  
  if (!data || data.length === 0) {
    Logger.log('No contact submissions found');
    return;
  }
  
  const sheet = getOrCreateSheet(SHEETS.CONTACTS);
  
  // Clear existing data except headers
  clearSheetKeepingHeaders(sheet);
  
  // Set headers if they don't exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Name', 'Email', 'Message', 'Created At']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
  
  // Format data for the sheet
  const rows = data.map(item => [
    item.id,
    item.name,
    item.email,
    item.message,
    new Date(item.created_at).toString()
  ]);
  
  // Append rows to the sheet
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 5).setValues(rows);
  }
  
  Logger.log(`Updated ${rows.length} contact submissions`);
}

/**
 * Fetches connection requests and updates the sheet
 */
function fetchConnectionRequests() {
  const data = fetchFromSupabase('connection_requests?select=id,email,message,status,created_at,story_id,stories(title,description,category)');
  
  if (!data || data.length === 0) {
    Logger.log('No connection requests found');
    return;
  }
  
  const sheet = getOrCreateSheet(SHEETS.CONNECTIONS);
  
  // Clear existing data except headers
  clearSheetKeepingHeaders(sheet);
  
  // Set headers if they don't exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Email', 'Message', 'Status', 'Story Title', 'Story Category', 'Created At']);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  }
  
  // Format data for the sheet
  const rows = data.map(item => [
    item.id,
    item.email,
    item.message,
    item.status,
    item.stories?.title || 'Unknown',
    item.stories?.category || 'Unknown',
    new Date(item.created_at).toString()
  ]);
  
  // Append rows to the sheet
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 7).setValues(rows);
  }
  
  Logger.log(`Updated ${rows.length} connection requests`);
}

/**
 * Fetches stories with like counts and updates the sheet
 */
function fetchStoriesWithLikes() {
  const data = fetchFromSupabase('stories');
  
  if (!data || data.length === 0) {
    Logger.log('No stories found');
    return;
  }
  
  const sheet = getOrCreateSheet(SHEETS.LIKES);
  
  // Get existing data to track changes
  const existingData = {};
  const headerRow = 1;
  
  if (sheet.getLastRow() > headerRow) {
    const existingRows = sheet.getRange(headerRow + 1, 1, sheet.getLastRow() - headerRow, 5).getValues();
    existingRows.forEach(row => {
      if (row[0]) {
        existingData[row[0]] = {
          previousLikes: row[3],
          title: row[1]
        };
      }
    });
  }
  
  // Clear existing data except headers
  clearSheetKeepingHeaders(sheet);
  
  // Set headers if they don't exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Title', 'Category', 'Current Likes', 'Previous Likes', 'Change', 'Last Updated']);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  }
  
  // Format data for the sheet with change tracking
  const rows = data.map(item => {
    const previousData = existingData[item.id] || { previousLikes: 0 };
    const previousLikes = parseInt(previousData.previousLikes) || 0;
    const currentLikes = parseInt(item.likes) || 0;
    const change = currentLikes - previousLikes;
    
    return [
      item.id,
      item.title,
      item.category,
      currentLikes,
      previousLikes,
      change,
      new Date().toString()
    ];
  });
  
  // Sort by likes (most to least)
  rows.sort((a, b) => b[3] - a[3]);
  
  // Append rows to the sheet
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 7).setValues(rows);
    
    // Conditional formatting for change column
    const changeColumn = 6;
    const rangeToFormat = sheet.getRange(2, changeColumn, rows.length, 1);
    
    // Clear existing conditional formatting
    const rules = sheet.getConditionalFormatRules();
    sheet.clearConditionalFormatRules();
    
    // Add rules for positive and negative changes
    const positiveRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(0)
      .setBackground('#d9ead3') // Light green
      .setRanges([rangeToFormat])
      .build();
      
    const negativeRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0)
      .setBackground('#f4cccc') // Light red
      .setRanges([rangeToFormat])
      .build();
      
    sheet.setConditionalFormatRules([positiveRule, negativeRule]);
  }
  
  Logger.log(`Updated ${rows.length} story likes`);
}

/**
 * Fetches story submissions and updates the sheet
 */
function fetchStorySubmissions() {
  const data = fetchFromSupabase('story_submissions');
  
  if (!data || data.length === 0) {
    Logger.log('No story submissions found');
    return;
  }
  
  const sheet = getOrCreateSheet(SHEETS.SUBMISSIONS);
  
  // Clear existing data except headers
  clearSheetKeepingHeaders(sheet);
  
  // Set headers if they don't exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Title', 'Category', 'Description', 'Name', 'Email', 'Status', 'Created At']);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
  }
  
  // Format data for the sheet
  const rows = data.map(item => [
    item.id,
    item.title,
    item.category,
    item.description,
    item.name || '',
    item.email || '',
    item.status,
    new Date(item.created_at).toString()
  ]);
  
  // Append rows to the sheet
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 8).setValues(rows);
  }
  
  Logger.log(`Updated ${rows.length} story submissions`);
}

/**
 * Helper function to fetch data from Supabase
 */
function fetchFromSupabase(endpoint) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  
  const options = {
    'method': 'GET',
    'contentType': 'application/json',
    'headers': {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=representation'
    }
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const jsonData = JSON.parse(response.getContentText());
    return jsonData;
  } catch (error) {
    Logger.log(`Error fetching from Supabase (${endpoint}): ${error}`);
    return [];
  }
}

/**
 * Gets an existing sheet or creates a new one
 */
function getOrCreateSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  return sheet;
}

/**
 * Clears a sheet but keeps the headers
 */
function clearSheetKeepingHeaders(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, lastCol).clear();
  }
}
