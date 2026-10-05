export const loadDailyDialog = async () => {
  try {
    const response = await fetch('/data/daily_dialog.csv');
    if (!response.ok) {
      return [];
    }

    const text = await response.text();
    const lines = text.trim().split(/\r?\n/);
    const rows = [];

    for (let i = 1; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (!line) continue;

      const [inputRaw, responseRaw] = line.split(/,(.*)/s);
      if (!inputRaw || !responseRaw) continue;

      const input = inputRaw.replace(/^"|"$/g, '').trim().toLowerCase();
      const response = responseRaw.replace(/^"|"$/g, '').trim();

      if (input && response) {
        rows.push({ input, response });
      }
    }

    return rows;
  } catch (error) {
    console.warn('Unable to load DailyDialog CSV:', error);
    return [];
  }
};

export const getDailyDialogReply = async (queryText) => {
  const rows = await loadDailyDialog();
  const cleanQuery = queryText.trim().toLowerCase();

  if (!cleanQuery || rows.length === 0) {
    return null;
  }

  const exactMatch = rows.find(row => row.input === cleanQuery);
  if (exactMatch) {
    return exactMatch.response;
  }

  const similarMatch = rows.find(row => cleanQuery.includes(row.input) || row.input.includes(cleanQuery));
  return similarMatch ? similarMatch.response : null;
};
