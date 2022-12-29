export const events = [
  {
    event: 'items.update',
    accountability: {
      user: 'bfc98cd2-0259-4bde-aaf2-fed71bfb1228',
      role: '3c0f9118-be27-4dd0-ad37-934fc881b9c8',
    },
    payload: {
      ISBN_13: 'qfqwfqwfqwf',
    },
    keys: ['c3899334-ed0b-4ddf-92fa-791c89d22caa'],
    collection: 'Books',
  },
  {
    event: 'items.create',
    accountability: {
      user: 'bfc98cd2-0259-4bde-aaf2-fed71bfb1228',
      role: '3c0f9118-be27-4dd0-ad37-934fc881b9c8',
    },
    payload: {
      ISBN_13: 'qwf',
      ISBN_10: 'qwf',
      aboutTheAuthor: 'qwdq',
      title: 'qwfqwf',
    },
    key: 'e4a7c0de-162d-4705-a9e2-096bac866159',
    collection: 'Books',
  },
  {
    event: 'items.delete',
    accountability: {
      user: 'bfc98cd2-0259-4bde-aaf2-fed71bfb1228',
      role: '3c0f9118-be27-4dd0-ad37-934fc881b9c8',
    },
    payload: [
      'e4b21ca2-6c9d-42ff-96ba-e2c28c6a02a1',
      'ae799f52-c123-4a1c-abf6-bdc7319268d9',
      'fdb28ec8-4abe-4276-ac99-eac630d86222',
      '636faa03-bfd3-445e-aeac-70e8dc07bb4c',
      'cdab9a2d-1880-4b75-b1c2-208c2dc64e38',
      '8f6d504c-f101-4a5d-9150-98b4e154ad02',
      '0ae66ca5-e704-4578-8186-674858fc703b',
      'c6a0a3e0-d878-4bfd-bab9-256a709c98ef',
      'c0218f88-60a6-48ce-b4e6-4f552045a2f7',
      '81ef1514-568b-4ca8-a96b-0d4a712a6518',
      'c3899334-ed0b-4ddf-92fa-791c89d22caa',
      'e4a7c0de-162d-4705-a9e2-096bac866159',
    ],
    keys: [
      'e4b21ca2-6c9d-42ff-96ba-e2c28c6a02a1',
      'ae799f52-c123-4a1c-abf6-bdc7319268d9',
      'fdb28ec8-4abe-4276-ac99-eac630d86222',
      '636faa03-bfd3-445e-aeac-70e8dc07bb4c',
      'cdab9a2d-1880-4b75-b1c2-208c2dc64e38',
      '8f6d504c-f101-4a5d-9150-98b4e154ad02',
      '0ae66ca5-e704-4578-8186-674858fc703b',
      'c6a0a3e0-d878-4bfd-bab9-256a709c98ef',
      'c0218f88-60a6-48ce-b4e6-4f552045a2f7',
      '81ef1514-568b-4ca8-a96b-0d4a712a6518',
      'c3899334-ed0b-4ddf-92fa-791c89d22caa',
      'e4a7c0de-162d-4705-a9e2-096bac866159',
    ],
    collection: 'Books',
  },
]

export const sampleBook = {
  data: {
    id: '50540047-7fa4-4d9f-b2eb-fb62891d971d',
    status: 'published',
    sort: null,
    user_created: 'bfc98cd2-0259-4bde-aaf2-fed71bfb1228',
    date_created: '2022-12-29T08:49:35.384Z',
    user_updated: null,
    date_updated: null,
    title: 'They Do it with Mirrors',
    authors: ['Agatha Christie'],
    publisher: 'HarperCollins UK',
    publishedDate: '2002-01-01',
    description:
      "Miss Marple senses danger when she visits a friend living in a Victorian mansion which doubles as a rehabilitation centre for young delinquents. Her fears are confirmed when a youth fires a gun at the administrator, but that isn't the only shooting!",
    ISBN_13: '9780007120871',
    ISBN_10: '0007120877',
    pageCount: 12,
    subtitle: null,
    categories: ['Attempted murder'],
    thumbnail: '292bdf70-a7de-48b2-a339-a80f0af33c33',
    language: 'en',
    googleBookLink:
      'http://books.google.com.hk/books?id=HUuQYGppZi8C&dq=isbn:9780007120871&hl=&source=gbs_api',
    aboutTheAuthor:
      'Agatha Christie was born in Torquay in 1890 and became, quite simply, the best-selling novelist in history. Her first novel, The Mysterious Affair at Styles, written towards the end of the First World War, introduced us to Hercule Poirot, who was to become the most popular detective in crime fiction since Sherlock Holmes. She is known throughout the world as the Queen of Crime. Her books have sold over a billion copies in the English language and another billion in over 100 foreign languages. She is the author of 80 crime novels and short story collections, 19 plays, and six novels under the name of Mary Westmacott.',
    internal_remark: null,
    storageLocation: null,
    quantity: 0,
    highlighted: false,
    otherImages: [],
  },
}
