export const VideoSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
          Visual Odometry <span className="text-gradient">Explained</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Deep dive into visual odometry techniques and implementation in autonomous robotics systems.
        </p>

        <div className="card-glass rounded-xl overflow-hidden">
          <div className="aspect-video bg-muted/30 flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-sm text-muted-foreground mb-2">
                Add your visual odometry video to:
              </p>
              <code className="text-xs bg-background/50 px-3 py-1 rounded">
                public/media/visual-odometry.mp4
              </code>
              <p className="text-xs text-muted-foreground mt-4">
                The video will automatically display here once added
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
