import { defineCliConfig } from 'sanity/cli';
import { projectId, dataset } from './project';

export default defineCliConfig({
  api: { projectId, dataset },
  // 线上后台：https://drlauharnni.sanity.studio（studio/ 下 npm run deploy）
  studioHost: 'drlauharnni',
  // 不跟着 Sanity 自动升级：升级时先在本机试过再部署
  deployment: { autoUpdates: false },
});
