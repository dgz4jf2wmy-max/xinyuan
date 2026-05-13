export interface FeedStatus {
  stem: 'normal' | 'abnormal';
  dust: 'normal' | 'abnormal';
  rod: 'normal' | 'abnormal';
}

export interface FeedDesc {
  stem: string;
  dust: string;
  rod: string;
}

export interface FeedRecord {
  id: string;
  batch: string;
  feedTime: string;
  inTime: string;
  status: FeedStatus;
  desc: FeedDesc;
}
