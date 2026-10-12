export type Story = {
  id: string;
  client: string;
  industry: string;
  headline: string;
  body: string;
  imageSrc?: string;
  confirmed: boolean;
};

export const SUCCESS_STORIES: Story[] = [];
