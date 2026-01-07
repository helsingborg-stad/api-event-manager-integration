import { createViteConfig } from "vite-config-factory";

const entries = {
  'js/event-integration-module-event': './source/js/Module/Event/index.tsx',
  'js/event-integration-front': './source/js/front/index.js',
  'js/event-integration-admin': './source/js/admin/index.js',
  'css/event-manager-integration': './source/sass/event-manager-integration.scss',
  'css/event-manager-integration-admin': './source/sass/event-manager-integration-admin.scss',
};

export default createViteConfig(entries, {
	outDir: "assets/dist",
	manifestFile: "manifest.json",
});
