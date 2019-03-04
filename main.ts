namespace effects {

    class CloudFactory extends particles.ParticleFactory {
        minRate: number;
        maxRate: number;
        clouds: Image[];
        camera: scene.Camera;

        constructor(anchor: particles.ParticleAnchor, minRate: number = 10, maxRate: number = 30) {
            super();

            this.minRate = minRate;
            this.maxRate = maxRate;
            this.camera = game.currentScene().camera;

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
            p._x = Fx.sub(
                Fx8(anchor.width ? anchor.x + (anchor.width >> 1) : anchor.x),
                Fx8(this.camera.offsetX)
            );
            p._y = Fx.sub(
                Fx8(Math.randomRange(anchor.y - yRange, anchor.y + yRange)),
                Fx8(this.camera.offsetY)
            );
            p.vx = Fx8(-Math.randomRange(this.minRate, this.maxRate));
            p.data = Math.randomRange(0, this.clouds.length - 1);

            // Using p.color as an extra image index; first bit is used to indicate it is used
            p.color = 0;
            if (Math.percentChance(60)) {
                const isConjoined = 1 << 0;
                const isOffsetX = Math.randomRange(0, 1) << 1;
                const isOffsetY = Math.randomRange(0, 1) << 2;
                const selection = Math.randomRange(0, this.clouds.length - 1) << 3;

                p.color = isConjoined | isOffsetX | isOffsetY | selection;
            }

            // set lifespan based off velocity and screen height (plus a little to make sure it doesn't disappear early)
            p.lifespan = Fx.toInt(Fx.mul(Fx.div(Fx8(screen.width + 30), Fx.abs(p.vx)), Fx8(1000)));

            return p;
        }

        drawParticle(p: particles.Particle, x: Fx8, y: Fx8) {
            const mainImage = this.clouds[p.data];
            screen.drawTransparentImage(
                mainImage,
                Fx.toInt(p._x),
                Fx.toInt(p._y)
            );

            if (p.color & 1) {
                const isOffsetX = (p.color >> 1) & 1;
                const isOffsetY = (p.color >> 2) & 1;
                const selection = this.clouds[p.color >> 3];

                const xOffset = isOffsetX ? Fx8(mainImage.width >> 1) : Fx.zeroFx8;
                const yOffset = isOffsetY ? Fx8(mainImage.height >> 1) : Fx.zeroFx8;

                screen.drawTransparentImage(
                    selection,
                    Fx.toInt(
                        Fx.add(
                            p._x,
                            xOffset
                        )
                    ),
                    Fx.toInt(
                        Fx.add(
                            p._y,
                            yOffset
                        )
                    )
                );
            }
        }
    }

    //% fixedInstance whenUsed block="clouds"
    export const clouds = new ScreenEffect(0.1, 0.5, 5000, function (anchor: particles.ParticleAnchor, particlesPerSecond: number) {
        const factory = new CloudFactory(anchor);
        const source = new particles.ParticleSource(anchor, particlesPerSecond, factory);
        source.z = -5;
        return source;
    });
} 