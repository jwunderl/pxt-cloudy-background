// Weird start up ordering, needed to do an extra pause
control.runInParallel(() => {
    pause(0); // requeue this to wait for scene to start
    scene.setBackgroundColor(0x9);
    effects.clouds.startScreenEffect();
    const m = sprites.create(img`2`)
    controller.moveSprite(m);
    scene.cameraFollowSprite(m);

    let running = false;
    game.onUpdate(function () {
        if (running) m.say("x" + m.x + " y" + m.y, 50);
    });

    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        running = !running;
    });
});