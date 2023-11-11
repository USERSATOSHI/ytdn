{ pkgs }: {
    deps = [
      pkgs.nodejs-16_x
        pkgs.strace
        pkgs.inotifyTools
        pkgs.strace
        pkgs.bashInteractive
        pkgs.unzip
        pkgs.htop
        pkgs.busybox
        pkgs.nodePackages.typescript-language-server
        pkgs.ffmpeg
        pkgs.libopus
    ];
}