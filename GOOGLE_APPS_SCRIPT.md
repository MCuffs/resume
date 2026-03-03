# Google Apps Script Setup Guide (Deprecated)

이 프로젝트는 보안/유지보수를 위해 리드 수집을 Google Apps Script에서 Vercel Serverless + Supabase로 이동했습니다.

- 새 엔드포인트: `POST /api/public/leads`
- 저장 테이블: `creator_applications`, `brand_inquiries` (RLS deny-all, service role만 접근)
- 스키마: `supabase/schema_v2.sql`

To ensure that both Creator and Brand applications are correctly received and stored in separate tabs in your Google Sheet, please replace your existing Google Apps Script with the code below.

## 1. Open Google Sheets
Open the Google Sheet where you want to collect the data.

## 2. Open Apps Script Editor
Click on **Extensions** > **Apps Script**.

## 3. Replace Code
Delete any existing code in the `Code.gs` file and paste the following:

```javascript
/*
 * Google Apps Script for Arthurian Form Submission
 * Handles both Creator and Brand applications and routes them to separate tabs.
 */

// Define Sheet Names
var SHEET_NAME_CREATOR = "Creator Applications";
var SHEET_NAME_BRAND = "Brand Applications";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Wait up to 10 seconds for concurrent access

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    
    // Parse the incoming data
    // When sending as text/plain (to avoid CORS preflight), the data is in e.postData.contents
    var data = JSON.parse(e.postData.contents);
    
    // Determine the target sheet based on formType
    var targetSheetName = SHEET_NAME_CREATOR; // Default
    if (data.formType === 'BrandApplication') {
      targetSheetName = SHEET_NAME_BRAND;
    } else if (data.formType === 'CreatorApplication') {
      targetSheetName = SHEET_NAME_CREATOR;
    }

    // Get or Create the Sheet
    var sheet = doc.getSheetByName(targetSheetName);
    if (!sheet) {
      sheet = doc.insertSheet(targetSheetName);
      // Add Headers based on type
      if (data.formType === 'BrandApplication') {
        sheet.appendRow(['Timestamp', 'Company Name', 'Contact Name', 'Email', 'Website', 'Product', 'Campaign Goal', 'Budget', 'Message']);
      } else {
        // Creator Headers
        sheet.appendRow(['Timestamp', 'Name', 'Handle', 'Phone', 'Email', 'Platform', 'Channel URL', 'Followers', 'Engagement', 'Category', 'Agreed']);
      }
    }

    // Prepare the row data
    var newRow = [];
    if (data.formType === 'BrandApplication') {
      newRow = [
        new Date(), // Timestamp
        data.companyName,
        data.contactName,
        data.email,
        data.website,
        data.productName,
        data.campaignGoal,
        data.budget,
        data.message
      ];
    } else {
      // Creator Application
      newRow = [
        new Date(), // Timestamp
        data.name,
        data.handle,
        data.phone,
        data.email,
        data.platform,
        data.channelUrl,
        data.followers,
        data.engagement,
        data.category,
        data.agreed
      ];
    }

    // Append the data
    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "row": newRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } finally {
    lock.releaseLock();
  }
}
```

## 4. Deploy
1. Click the blue **Deploy** button > **New deployment**.
2. Select type: **Web app**.
3. Description: `v1` (or anything you like).
4. Execute as: **Me** (your email).
5. Who has access: **Anyone** (IMPORTANT!).
6. Click **Deploy**.
7. Copy the **Web App URL**.
8. **IMPORTANT:** If the URL has changed, you must update it in your `src/pages/BrandApplyPage.tsx` and `src/pages/CreatorApplyPage.tsx` files. If you are just updating the code within the same project and re-deploying as a new version under the same ID using "Manage Deployments" -> "Edit", the URL might stay the same. **However, it is safest to check.**

**Note:** If you run `npm run dev` locally, CORS errors might still appear in the console even if the data is sent successfully. The `no-cors` mode in fetch + `text/plain` content type + `Anyone` access in Apps Script is the standard workaround for this.
