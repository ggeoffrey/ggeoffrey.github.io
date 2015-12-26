// Start a worker to run the Barnes-Hut simulation on a separated thread.
importScripts("d3-3d.js");  // With d3.layout.force3d().
importScripts("gravity.js");  // Should be already cached


gravity.force.worker.create();  // Listen to your parent !
