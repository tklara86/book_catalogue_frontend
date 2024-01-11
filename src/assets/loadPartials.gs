function loadPartialHTML_(partial) {
  const htmlService = HtmlService.createTemplateFromFile(partial)
  return htmlService.evaluate().getContent();
}

function loadSearchView() {
  return loadPartialHTML_("search")
}

function loadAddCustomerView() {
  return loadPartialHTML_("addCustomer")
}

function loadEditCustomerView() {
  return loadPartialHTML_("editCustomer")
}

