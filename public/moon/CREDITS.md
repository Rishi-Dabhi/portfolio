# Lunar texture credits

Source: [NASA Scientific Visualization Studio — CGI Moon Kit](https://svs.gsfc.nasa.gov/4720/).

Credit: NASA's Scientific Visualization Studio. Visualizations by Ernie Wright (STC); scientist Noah Petro (NASA/GSFC).

- `lroc-color-4k.jpg`: 2025 LROC natural-color map, 4096 × 2048. Converted from NASA's 16-bit sRGB TIFF to a quality-93 JPEG with full chroma resolution for local web delivery. Adapted by NASA SVS from Lunar Reconnaissance Orbiter Camera data assembled by the LROC team at Arizona State University.
- `lroc-color-2k.jpg`: original 2048 × 1024 version of the color map, used on WebGL devices that cannot upload 4K textures.
- `lola-height-1k.jpg`: LOLA lunar elevation map, 1024 × 512. Source: Lunar Orbiter Laser Altimeter / Lunar Reconnaissance Orbiter.

The files are served locally. The portfolio uses the color map as spherical albedo and the elevation map for surface-normal relief. Illumination and phase are rendered in WebGL; the scroll transition is artistic rather than a simulation of the Moon's current phase.

Original assets:
- https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_16bit_srgb_4k.tif
- https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_2k.jpg
- https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/ldem_3_8bit.jpg
