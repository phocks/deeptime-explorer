export type StoryField = {
  yearsAgo?: number;
  storyType?: string[];
  storyNumber?: number;
  slug?: string;
  story?: string;
  factBox?: string;
  referenceList?: string;
  consultFormCreated?: boolean;
  state?: string[];
  consultation?: string[];
  consultBriefStatus?: string[];
  reporterContactMadeBy?: any;
  date?: string;
  reporterComms?: string;
  assignedTo?: string[];
  specificGrouping?: string[];
  regionalTeam?: string[];
  status?: string[];
  sensitivity?: string[];
  community?: string;
  contactDetails?: string;
  editorialNotes?: string;
  contactNotes?: string;
  consultationNotes?: string;
  proposedChanges?: string;
  proposedStoryReDraft?: string;
  proposedFactBoxReDraft?: string;
  factCheck?: string[];
  credits?: string;
  sentToCommunity?: boolean;
  videoAudioPriority?: string[];
  consentFormSigned?: string[];
  audioRecorded?: boolean;
  languageRecording?: string[];
  additionalStory?: string;
  separate?: boolean;
  category?: string[];
  map?: string[];
  mapPinned?: boolean;
  priority?: string[];
  yesNoMaybe?: string[];
  actionNotes?: string;
  originalAuthor?: any;
  linkedStories?: any;
  otherStories?: any;
  rolloutStoryPossibles?: string[];
  externalConsultation?: boolean;
  latLong?: string;
  consultationType?: string;
  yearChecked?: boolean;
};

const LOOKUP_TABLE = require("./dataMap.json");

export const mapData = originalData => {
  const mapped = originalData.map(item => {
    const originalFields = item.fields;
    const mappedFields = {};

    for (let field in originalFields) {
      if (LOOKUP_TABLE[field]) {
        mappedFields[LOOKUP_TABLE[field]] = originalFields[field];
      }
    }

    return { ...item, mapped: mappedFields };
  });

  return mapped;
};

export default mapData;
