namespace effects {

    class CloudFactory extends particles.ParticleFactory {
        minRate: number;
        maxRate: number;
        clouds: Image[];

        constructor(anchor: particles.ParticleAnchor, minRate: number = 15, maxRate: number = 25) {
            super();

            this.minRate = minRate;
            this.maxRate = maxRate;

            this.clouds = [
                img`
                    . . . . . . . . . . . f . . . .
                    . . . . . . . . . . f 1 f . . .
                    . . . . . . . . . f 1 9 1 f . .
                    . . f . . f f . f 1 9 9 9 9 f .
                    . f 1 f f 1 1 f 9 9 1 1 1 9 1 f
                    f 1 9 1 9 9 1 9 9 1 1 1 1 9 9 f
                    f 9 1 9 9 1 9 1 1 9 1 1 1 1 1 f
                    . f 1 1 1 1 1 1 1 1 1 1 1 1 1 f
                    f 1 1 1 1 1 1 1 1 1 1 1 1 1 1 f
                    . f 1 f f 1 f 1 f 1 1 f 1 1 1 f
                    . . f f . f . f . f f . f f f .
                `, img`
                    . . . . . . f f . . . .
                    . . . f . f 1 1 f . . .
                    . f f 1 f 1 9 9 1 f . .
                    f 1 1 1 1 1 1 1 9 f f .
                    . f 1 9 9 1 9 1 1 1 1 f
                    f 1 1 f f 1 1 1 1 1 f .
                    . f f . f 1 f 1 f f . .
                    . . . . . f . f . . . .
                `, img`
                    . . . . . . . . f f . f f f
                    . . f . . . . f 1 1 f 1 1 f
                    . f 1 f . . . f 1 9 9 f 1 f
                    f 1 1 1 f . f 1 1 1 1 1 1 f
                    f 1 9 1 f f 1 1 9 1 1 1 1 f
                    f 1 1 9 1 1 1 9 1 1 1 1 1 f
                    . f 1 9 1 1 9 9 1 1 1 1 f .
                    . . f 1 1 9 9 1 1 1 1 f . .
                    . . f 1 1 1 1 1 1 f f . . .
                    . . . f 1 1 1 f f f . . . .
                    . . . . f f f . . . . . . .
                `, img`
                    . f f f .
                    f 1 9 1 f
                    f 9 1 1 f
                    . f 1 f .
                    . . f . .
                `
            ];
        }

        createParticle(anchor: particles.ParticleAnchor) {
            const p = super.createParticle(anchor);
            const yRange = anchor.height ? anchor.height >> 1 : 8;

            p._x = Fx8(anchor.width ? anchor.x + (anchor.width >> 1) : anchor.x);
            p._y = Fx8(Math.randomRange(anchor.y - yRange, anchor.y + yRange));
            p.vx = Fx8(-Math.randomRange(this.minRate, this.maxRate));
            p.data = Math.randomRange(0, this.clouds.length - 1);

            // set lifespan based off velocity and screen height (plus a little to make sure it doesn't disappear early)
            p.lifespan = Fx.toInt(Fx.mul(Fx.div(Fx8(screen.width + 60), Fx.abs(p.vx)), Fx8(1000)));

            return p;
        }

        drawParticle(p: particles.Particle, x: Fx8, y: Fx8) {
            // screen.setPixel(Fx.toInt(x), Fx.toInt(y), 1);
            screen.drawTransparentImage(this.clouds[p.data], Fx.toInt(p._x), Fx.toInt(p._y));
        }
    }

    //% fixedInstance whenUsed block="clouds"
    export const clouds = new ScreenEffect(0.1, 0.5, 5000, function (anchor: particles.ParticleAnchor, particlesPerSecond: number) {
        const factory = new CloudFactory(anchor);
        const source = new particles.ParticleSource(anchor, particlesPerSecond, factory);
        source.z = -1;
        return source;
    });

    /** TEST, remove this */
    control.runInParallel(() => {
        pause(100); // wait for scene to start
        scene.setBackgroundColor(0x9);
        effects.clouds.startScreenEffect();
        const m = sprites.create(img`2`)
        controller.moveSprite(m);
        scene.cameraFollowSprite(m);
    });
} 