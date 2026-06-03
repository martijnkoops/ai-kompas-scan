/**
 * Google Apps Script - AI Literacy Mission Backend
 * 
 * Dit script ontvangt de resultaten van het competentiespel via een POST-verzoek
 * en schrijft deze weg naar een Google Sheet.
 * 
 * Instructies:
 * 1. Open Google Sheets (https://sheets.google.com).
 * 2. Maak een nieuwe lege Spreadsheet aan.
 * 3. Ga naar Extensies -> Apps Script.
 * 4. Vervang alle code in de editor met dit Code.gs bestand.
 * 5. Sla het project op (klik op het schijf-icoon).
 * 6. Klik rechtsboven op 'Implementeren' -> 'Nieuwe implementatie'.
 * 7. Selecteer type 'Web-app'.
 * 8. Vul in:
 *    - Beschrijving: AI Literacy Mission Backend
 *    - Uitvoeren als: Ikzelf (jouw e-mail)
 *    - Wie heeft toegang: Iedereen (dit is verplicht voor anonieme frontend verzoeken)
 * 9. Klik op Implementeren.
 * 10. Kopieer de 'Web-app-URL' en plak deze bovenaan in index.html bij APPS_SCRIPT_URL.
 */

var TARGET_SHEET_NAME = "Blad1";

function doPost(e) {
  // CORS Headers instellen voor preflight bypasses en algemene compatibiliteit
  var responseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    // 1. Verkrijg de ruwe JSON payload
    var postData = e.postData.contents;
    var data = JSON.parse(postData);

    // 2. Open de doeltab in de spreadsheet waaraan dit script is gekoppeld.
    //    Als het script losstaat (standalone), gebruik dan SpreadsheetApp.openById("JOUW_SHEET_ID")
    //    in getTargetSheet().
    var sheet = getTargetSheet();
    
    // 3. Controleer of de sheet nieuw/leeg is om de kolomkoppen te schrijven
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp", 
        "Anonymous ID", 
        "Basis & Ethiek Score", 
        "Didactiek & Techniek Score", 
        "Visie & Beleid Score", 
        "Totale Score", 
        "Level Details (JSON)"
      ];
      sheet.appendRow(headers);
      
      // Maak de header rij vetgedrukt
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    }

    // 4. Bereid de rij-data voor uit de parser
    var rowData = [
      data.timestamp || new Date().toISOString(),
      data.anonymousId || "ANON-DOC",
      data.basisEthiek !== undefined ? Number(data.basisEthiek) : 0,
      data.didactiekTechniek !== undefined ? Number(data.didactiekTechniek) : 0,
      data.visieBeleid !== undefined ? Number(data.visieBeleid) : 0,
      data.totalScore !== undefined ? Number(data.totalScore) : 0,
      data.levelDetails || ""
    ];

    // 5. Voeg de rij toe aan de Google Sheet
    sheet.appendRow(rowData);

    // 6. Succesvolle JSON-respons retourneren
    var resultOutput = JSON.stringify({
      success: true,
      message: "Data succesvol opgeslagen.",
      rowInserted: sheet.getLastRow()
    });

    return ContentService.createTextOutput(resultOutput)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Foutafhandeling en loggen naar Apps Script console
    Logger.log("Fout in doPost: " + error.toString());

    var errorOutput = JSON.stringify({
      success: false,
      message: "Er is een fout opgetreden bij het verwerken van de gegevens.",
      error: error.toString()
    });

    return ContentService.createTextOutput(errorOutput)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = getTargetSheet();
    var output = JSON.stringify({
      success: true,
      message: "Backend is bereikbaar.",
      sheetName: sheet.getName(),
      rows: sheet.getLastRow()
    });

    return ContentService.createTextOutput(output)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    var errorOutput = JSON.stringify({
      success: false,
      message: "Backend bereikbaar, maar Sheet openen mislukt.",
      error: error.toString()
    });

    return ContentService.createTextOutput(errorOutput)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getTargetSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(TARGET_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(TARGET_SHEET_NAME);
  }

  return sheet;
}

/**
 * Optionele helperfunctie om preflight OPTIONS verzoeken af te handelen 
 * mocht de browser hier toch om vragen.
 */
function doOptions(e) {
  var responseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
