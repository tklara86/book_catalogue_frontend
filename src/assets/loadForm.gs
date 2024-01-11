function loadMainForm() {
    const htmlService = HtmlService.createTemplateFromFile("main");
    const html = htmlService.evaluate();
    html.setWidth(850).setHeight(600)
    const ui = SpreadsheetApp.getUi();
    ui.showModalDialog(html, "Edit Customer data")
  }
  
  function createMenu_() {
    const ui = SpreadsheetApp.getUi();
    const menu = ui.createMenu("Edit Spreadsheet");
    menu.addItem("Open Form", "loadMainForm")
    menu.addToUi();
  }
  
  
  function onOpen() {
    createMenu_()
  }
  
  