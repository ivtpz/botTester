import BotBuilder from '@/components/BotBuilder';
const BotTester = { name: 'BotTester' };


const routes = [
  {
    path: '/',
    name: 'bot-builder',
    displayName: 'Build a Bot',
    component: BotBuilder,
  },
  {
    path: '/backtest',
    name: 'bot-tester',
    displayName: 'Test a Bot',
    component: BotTester,
  },
  {
    path: '/live-bots',
    name: 'live-bots',
    displayName: 'Live Bots',
    component: BotBuilder,
  },
];

export default routes;