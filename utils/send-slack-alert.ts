export async function sendSlackAlert(message: string) {
  const url = process.env.SLACK_WEBHOOK_URL
  if (!url) return

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  }).catch(() => {
    // Do nothing — avoid recursive failures
  })
}
