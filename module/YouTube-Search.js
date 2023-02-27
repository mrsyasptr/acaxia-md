import yts from "yt-search"

export function ytsearch(query) {
  return new Promise((resolve, reject) => {
    let sections = []
    yts({ query, limit: 7 }, async (err, res) => {
      if (err) {
        reject(err)
        return
      }
      for (let i = 0; i < res.videos.length; i++) {
        if (res.videos[i].author.name.match("- Topic")) {
          sections.push({
            title: `(${res.videos[i].timestamp}) ${res.videos[i].title}`,
            rows: [
              {
                title: "Audio",
                description: `Views: ${res.videos[i].views.abbreviate()}\n${res.videos[i].author.name}`,
                rowId: `.yta ${res.videos[i].url}`,
              },
            ],
          })
        } else {
          sections.push({
            title: `(${res.videos[i].timestamp}) ${res.videos[i].title}`,
            rows: [
              {
                title: "Audio",
                description: `Views: ${res.videos[i].views.abbreviate()}\n${res.videos[i].author.name} ${res.videos[i].ago}`,
                rowId: `.yta ${res.videos[i].url}`,
              },
              {
                title: "Video",
                description: `Views: ${res.videos[i].views.abbreviate()}\n${res.videos[i].author.name} ${res.videos[i].ago}`,
                rowId: `.ytv ${res.videos[i].url}`,
              },
            ],
          })
        }
      }
      resolve(sections)
    })
  })
}

