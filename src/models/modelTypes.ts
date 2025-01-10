export interface Message {
  id: number | string;
  role: string;
  content: string;
}

export interface ScrapeRequest {
  prompt: string;
  url: string;
  max_execution_time: number;
  filter: boolean;
  store: boolean;
}
