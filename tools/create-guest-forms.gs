/**
 * Run createWeddingGuestForms in a new standalone Google Apps Script project.
 * The forms start unpublished. Their response spreadsheets stay in your Drive.
 */
function createWeddingGuestForms() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const properties = PropertiesService.getScriptProperties();
    const hairAndMakeup = ensureGuestForm_(properties, 'hairAndMakeup', {
      title: 'Shivangi & Shaan | Hair & makeup',
      description: 'Please send a separate request for each guest and event. Ready-by times should be in Jaipur time (IST).',
      confirmation: 'Thanks! The coordinator will email you to confirm availability, timing and pricing.',
      fields: [
        { title: 'Guest name', kind: 'text', required: true },
        { title: 'Email for confirmation', kind: 'email', required: true },
        {
          title: 'Which service would you like?', kind: 'choice', required: true,
          choices: ['Hair and makeup', 'Hair only', 'Makeup only']
        },
        {
          title: 'Which event are you getting ready for?', kind: 'choice', required: true,
          choices: [
            'Dec 27 · Mehendi Mela & Haldi',
            'Dec 27 · Sangeet & Cocktails',
            'Dec 28 · Baraat',
            'Dec 28 · Varmala & Pheras',
            'Dec 28 · Reception'
          ]
        },
        { title: 'What time do you need to be ready?', kind: 'time', required: true, help: 'Use Jaipur time (IST).' },
        { title: 'Scheduling notes', kind: 'paragraph', required: false }
      ]
    });
    const songRequests = ensureGuestForm_(properties, 'songRequests', {
      title: 'Shivangi & Shaan | Song requests',
      description: 'One song per submission. Feel free to send another if you have more favourites.',
      confirmation: 'Thank you! We’ll share your suggestion with the music team.',
      fields: [
        { title: 'Song title', kind: 'text', required: true },
        { title: 'Artist or version', kind: 'text', required: false },
        {
          title: 'Where would you like to hear it?', kind: 'choice', required: false,
          choices: ['Sangeet', 'Reception', 'Either']
        },
        { title: 'Your name', kind: 'text', required: false }
      ]
    });
    console.log('Hair & makeup — edit and publish: ' + hairAndMakeup.editUrl);
    console.log('Song requests — edit and publish: ' + songRequests.editUrl);
    console.log('Hair & makeup responses: ' + hairAndMakeup.responseSheetUrl);
    console.log('Song request responses: ' + songRequests.responseSheetUrl);
    console.log('Publish each form, then copy the two responder links for the website.');
  } finally {
    lock.releaseLock();
  }
}

function ensureGuestForm_(properties, key, settings) {
  const formIdKey = key + '.formId';
  const existingFormId = properties.getProperty(formIdKey);
  const form = existingFormId ? FormApp.openById(existingFormId) : FormApp.create(settings.title, false);
  if (!existingFormId) properties.setProperty(formIdKey, form.getId());

  const readyKey = key + '.configured';
  if (!properties.getProperty(readyKey)) {
    form.setDescription(settings.description);
    form.setConfirmationMessage(settings.confirmation);
    form.setCollectEmail(false);
    form.setPublishingSummary(false);
    form.setLimitOneResponsePerUser(false);

    const existingTitles = new Set(form.getItems().map(item => item.getTitle()));
    settings.fields.forEach(field => {
      if (existingTitles.has(field.title)) return;
      const item = addGuestQuestion_(form, field);
      item.setTitle(field.title).setRequired(field.required);
      if (field.help) item.setHelpText(field.help);
    });
    properties.setProperty(readyKey, 'true');
  }

  let sheetId = form.getDestinationId();
  if (!sheetId) {
    const sheetKey = key + '.sheetId';
    sheetId = properties.getProperty(sheetKey);
    if (!sheetId) {
      const sheet = SpreadsheetApp.create(settings.title + ' responses');
      sheetId = sheet.getId();
      properties.setProperty(sheetKey, sheetId);
      sheet.setSpreadsheetTimeZone('Asia/Kolkata');
    }
    form.setDestination(FormApp.DestinationType.SPREADSHEET, sheetId);
  }
  return { editUrl: form.getEditUrl(), responseSheetUrl: SpreadsheetApp.openById(sheetId).getUrl() };
}

function addGuestQuestion_(form, field) {
  switch (field.kind) {
    case 'choice':
      return form.addListItem().setChoiceValues(field.choices);
    case 'time':
      return form.addTimeItem();
    case 'paragraph':
      return form.addParagraphTextItem();
    case 'email':
      return form.addTextItem().setValidation(FormApp.createTextValidation().requireTextIsEmail().build());
    default:
      return form.addTextItem();
  }
}
