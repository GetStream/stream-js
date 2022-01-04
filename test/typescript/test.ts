/* eslint-disable */
import * as Faye from 'faye';
import {
  connect,
  StreamClient,
  EnrichedActivity,
  NotificationActivity,
  APIResponse,
  FileUploadAPIResponse,
  GetActivitiesAPIResponse,
  OGAPIResponse,
  PersonalizationFeedAPIResponse,
  Activity,
  CollectionEntry,
  StreamUser,
  StreamFeed,
  FeedAPIResponse,
  FlatActivity,
  RealTimeMessage,
} from '../..';

type UserType = { name: string; image?: string };
type ActivityType = { aText: string; attachments?: string[] };
type CollectionType = { cid: string };
type ReactionType = { rText: string };
type ChildReactionType = { cText: string };
type T = {};

type Generics = {
  userType: UserType;
  activityType: ActivityType;
  collectionType: CollectionType;
  reactionType: ReactionType;
  childReactionType: ChildReactionType;
  personalizationType: Faye.UR;
};

let voidReturn: void;
let voidPromise: Promise<void>;
let emptyAPIPromise: Promise<APIResponse>;

let client: StreamClient<Generics> = connect<Generics>('api_key', 'secret!', 'app_id');

client = new StreamClient<Generics>('api_key', 'secret!', 'app_id');

connect('', null);
connect('', null, '', {});
connect('', null, '', { timeout: 3000, keepAlive: true, expireTokens: false });

new StreamClient('', null);
new StreamClient('', null, '', {});
new StreamClient('', null, '', { timeout: 3000, keepAlive: true, expireTokens: false });

// @ts-expect-error
connect('', null, true, {});
// @ts-expect-error
connect('', null, '', { missingOption: '' });
// @ts-expect-error
new StreamClient('', '', true, {});
// @ts-expect-error
new StreamClient('', '', '', { missingOption: '' });

const agent: string = client.userAgent();

const token: string = client.getOrCreateToken();
const pToken: string = client.getPersonalizationToken();
const cToken: string = client.getCollectionsToken();
const aToken: string = client.getAnalyticsToken();
const rToken: string = client.getReadOnlyToken('', '');
const rwToken: string = client.getReadWriteToken('', '');
const uToken: string = client.createUserToken('');
client.createUserToken('', { anything: {} });
// @ts-expect-error
client.getReadOnlyToken();
// @ts-expect-error
client.getReadWriteToken();

const baseUrl: string = client.getBaseUrl();
client.getBaseUrl('api');

const enrichedUrl: string = client.enrichUrl('');
client.enrichUrl('', '');

// @ts-expect-error
client.enrichUrl();

voidReturn = client.on('', () => {});
// @ts-expect-error
client.on('');
voidReturn = client.off();
voidReturn = client.off('');

voidReturn = client.send('');
client.send('', 1, 3, true, []);

const shouldEnrich: boolean = client.shouldUseEnrichEndpoint();

client.shouldUseEnrichEndpoint({
  enrich: true,
  ownReactions: true,
  withOwnChildren: true,
  withReactionCounts: true,
  withRecentReactions: true,
});
// @ts-expect-error
client.shouldUseEnrichEndpoint({ enrich: '' });

const faye: Faye.Client<RealTimeMessage<Generics>> = client.getFayeClient();
client.getFayeClient(100);

const upload: Promise<FileUploadAPIResponse> = client.upload('/file', 'uri');

client.upload('/image', new File([], ''));
client.upload('/image', new File([], ''), '', '');
// @ts-expect-error
client.upload('/image', []);

const ogPromise: Promise<OGAPIResponse> = client.og('');
ogPromise.then((og) => {
  const { title } = og;
  const { site } = og;
  const { url } = og;
  og.images[0].url as string;
  og.images[0].width as number;
  // @ts-expect-error
  og.images[0].url as number;
});
// @ts-expect-error
client.og();

const axiosConfig = { token: '', url: '' };
const response: T = client.handleResponse<T>({ data: {}, status: 100, statusText: '', headers: {}, config: {} });
const axiosReq: Promise<T> = client.doAxiosRequest<T>('GET', axiosConfig);
// @ts-expect-error
client.doAxiosRequest<T>('', {});
// @ts-expect-error
client.doAxiosRequest<T>('POST', {});

const get: T = client.get<T>(axiosConfig);
const post: T = client.post<T>(axiosConfig);
const put: T = client.put<T>(axiosConfig);
const del: T = client.delete<T>(axiosConfig);
emptyAPIPromise = client.delete(axiosConfig);
// @ts-expect-error
client.get<T>();

const emptyActivity = {
  foreign_id: '',
  time: '',
  verb: '',
  actor: '',
  object: '',
};
emptyAPIPromise = client.updateActivity({ ...emptyActivity, aText: '' });
emptyAPIPromise = client.updateActivities([{ ...emptyActivity, aText: '' }]);
// @ts-expect-error
client.updateActivity(emptyActivity);
// @ts-expect-error
client.updateActivities([emptyActivity]);

const partialUpdatePromise: Promise<Activity<Generics>> = client.activityPartialUpdate({
  id: '',
  set: { aText: '' },
  unset: ['attachments'],
});
client.activityPartialUpdate({ time: '', foreign_id: '', unset: ['aText'] });

// @ts-expect-error
client.activityPartialUpdate({ unset: ['missing'] });
// @ts-expect-error
client.activityPartialUpdate({ set: { missing: '' } });

const partialUpdatesPromise: Promise<{ activities: Activity<Generics>[] }> = client.activitiesPartialUpdate([
  {
    id: '',
    set: { aText: '' },
    unset: ['attachments'],
  },
]);
client.activitiesPartialUpdate([{ time: '', foreign_id: '', unset: ['aText'] }]);

// @ts-expect-error
client.activityPartialUpdate([{ unset: ['missing'] }]);
// @ts-expect-error
client.activityPartialUpdate([{ set: { missing: '' } }]);

const activitiesPromise: Promise<GetActivitiesAPIResponse<Generics>> = client.getActivities({ ids: ['', ''] });
activitiesPromise.then(({ results }) => {
  results[0].id as string;
  results[0].time as string;
  results[0].foreign_id as string;
  results[0].actor as string;
  const object: string = results[0].object as string;
  results[0].aText as string;
});

client.getActivities({ foreignIDTimes: [{ foreignID: '', time: '' }] });
client.getActivities({ ids: ['', ''], enrich: true, ownReactions: true });
client.getActivities({});
// @ts-expect-error
client.getActivities();

const pFeedPromise: Promise<PersonalizationFeedAPIResponse<Generics>> = client.personalizedFeed({ enrich: true });
pFeedPromise.then((pFeed) => {
  pFeed.results as Array<EnrichedActivity>;
  pFeed.version as string;
  pFeed.next as string;
  pFeed.limit as number;
  pFeed.offset as number;
});

const userPromise: Promise<StreamUser<Generics>> = client.setUser({ name: '' });
// @ts-expect-error
client.setUser({ username: '' });

const user: StreamUser<Generics> = client.user('user_id');
const userGet: Promise<StreamUser<Generics>> = client.user('user_id').get();
client.user('user_id').get({ with_follow_counts: true });
// @ts-expect-error
client.user('user_id').get({ with_follow_counts: 1 });
// @ts-expect-error
client.user('user_id').get({ list: true });

const timeline: StreamFeed<Generics> = client.feed('timeline', 'feed_id');

timeline.get({ withOwnChildren: true, withOwnReactions: true }).then((response: FeedAPIResponse<Generics>) => {
  response.next as string;
  response.unread as number;
  response.unseen as number;
  response.results as FlatActivity<Generics>[];
});

client
  .feed('notification', 'feed_id')
  .get({ mark_read: true, mark_seen: true })
  .then((response) => {
    response.next as string;
    response.unread as number;
    response.unseen as number;
    response.results as NotificationActivity<Generics>[];
  });

const collection: Promise<CollectionEntry<Generics>> = client.collections.get('collection_1', 'taco');

collection.then((item) => {
  item.id as string;
  item.data.cid as string;
  item.collection as string;
});
