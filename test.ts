// tests go here; this will not be compiled when this package is used as a library

// Weird start up ordering, needed to do an extra pause
control.runInParallel(() => {
    pause(100); // wait for scene to start
    scene.setBackgroundColor(0x9);
    effects.clouds.startScreenEffect();
    const m = sprites.create(img`2`)
    controller.moveSprite(m);
    scene.cameraFollowSprite(m);
});