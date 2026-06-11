export const links = {
  github: 'https://github.com/rhlc',
  linkedin: 'https://linkedin.com/in/rhlc',
  email: 'rahulcy7@gmail.com',
}

export const hero = {
  name: 'RAHUL C',
  tagline: 'Full-stack engineer. Zero to one, then to scale.',
  bootLog: [
    { prompt: 'whoami', output: 'tech lead · full-stack · bengaluru' },
    { prompt: 'stack --top', output: 'go · typescript · react · postgres' },
    { prompt: 'uptime', output: '5+ years shipping production systems' },
  ],
}

export const clouds = [
  { id: 'aws', label: 'AWS' },
  { id: 'azure', label: 'AZURE' },
  { id: 'gcp', label: 'GCP' },
  { id: 'alibaba', label: 'ALIBABA' },
  { id: 'tencent', label: 'TENCENT' },
  { id: 'huawei', label: 'HUAWEI' },
]

export const multiCloud = {
  index: '01',
  kicker: 'rahul --current-role',
  title: 'One platform. Six clouds.',
  beats: [
    'Technical Lead @ AND AI — owning architecture for a multi-cloud cost platform.',
    'ETL pipelines on Redis + BullMQ pull billing & ops data from every provider.',
    'Scheduled refresh cadence — dashboards never serve stale numbers.',
  ],
}

export const goRewrite = {
  index: '02',
  kicker: 'git log --grep="rewrite"',
  title: 'NestJS → Go.',
  subtitle: 'Led the core backend rewrite at Coreyo.',
  bars: [
    { label: 'MEDIAN LATENCY', from: 100, to: 38 },
    { label: 'SERVER COST', from: 100, to: 52 },
  ],
  services: ['auth', 'orders', 'billing', 'tracking', 'notify'],
  monolithLabel: 'nestjs-monolith',
  outro: 'One monolith became five independently deployable Go services. Failures now stop at a service boundary.',
}

export const web3 = {
  index: '03',
  kicker: 'cat ./onchain.sol',
  title: 'Contracts that settled real money.',
  body: 'Wrote, tested and deployed Solidity contracts for NFT minting & airdrops — settling production transactions on Polygon.',
  card: {
    name: 'NEON SUNDAE',
    desc: 'Freelance marketplace on Polygon. Built from scratch in a 4-person team — contracts, web3.js wallet flows, the lot.',
    tags: ['solidity', 'polygon', 'web3.js', 'nft'],
  },
}

export const zeroToOne = {
  index: '04',
  kicker: 'ls ~/shipped',
  title: 'Zero → one, repeatedly.',
  cards: [
    {
      name: 'blur-social',
      desc: 'Consumer social app built end-to-end: feed, profiles, likes, follows. Stripe subscriptions launched the company’s first paid plan.',
    },
    {
      name: 'neon-sundae',
      desc: 'Web3 freelance marketplace, idea to mainnet with a 4-person team.',
    },
  ],
}

export const stats = [
  { value: 5, suffix: '+', label: 'years shipping' },
  { value: 6, suffix: '', label: 'clouds unified' },
  { value: 5, suffix: '', label: 'go microservices' },
  { value: 2, suffix: '', label: 'products 0→1' },
]

export const footer = {
  kicker: 'open --mailto',
  title: 'Let’s build something.',
}
