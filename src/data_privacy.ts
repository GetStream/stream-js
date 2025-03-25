import { StreamClient, APIResponse } from './client';

export type ActivityToDelete = {
  id: string;
  remove_from_feeds: string[];
};

export type ExportIDsResult = {
  activity_count: number;
  reaction_count: number;
  activity_ids?: string[];
  reaction_ids?: string[];
  user_id?: string;
};

export type ExportIDsResponse = APIResponse & {
  export?: ExportIDsResult;
};

export function deleteActivities(this: StreamClient, activities: ActivityToDelete[]): Promise<APIResponse> {
  this._throwMissingApiSecret();

  return this.post<APIResponse>({
    url: 'data_privacy/delete_activities/',
    body: { activities },
    token: this.getOrCreateToken(),
  });
}

export function deleteReactions(this: StreamClient, ids: string[]): Promise<APIResponse> {
  this._throwMissingApiSecret();

  return this.post<APIResponse>({
    url: 'data_privacy/delete_reactions/',
    body: { ids },
    token: this.getOrCreateToken(),
  });
}

export function exportUserActivitiesAndReactionIDs(this: StreamClient, userId: string): Promise<ExportIDsResponse> {
  if (!userId) {
    throw new Error("User ID can't be null or empty");
  }

  return this.get<ExportIDsResponse>({
    url: `data_privacy/export_ids/${userId}`,
    token: this.getOrCreateToken(),
  });
}

export default {
  deleteActivities,
  deleteReactions,
  exportUserActivitiesAndReactionIDs,
};
