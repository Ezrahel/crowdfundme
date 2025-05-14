package fundraising

type Campaign struct {
	id                int    `json:"id"`
	Title             string `json:"title"`
	Description       string `json:"description"`
	Story             string `json:"story"`
	CampaignDuration  `json:"campaign_duration"`
	CoverImageOrVideo `json:"cover_image_or_video"`
}
