import struct
import zlib
import os

def create_png(width, height, draw_fn, output_path):
    # PNG Signature
    png_signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    # Width, Height, Bit depth (8), Color type (6 = RGBA), Compression (0), Filter (0), Interlace (0)
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    ihdr_chunk = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # Image raster lines
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # Filter type 0 (None)
        for x in range(width):
            r, g, b, a = draw_fn(x, y, width, height)
            raw_data.extend([r, g, b, a])
            
    # IDAT chunk
    compressed_data = zlib.compress(bytes(raw_data), level=9)
    idat_crc = zlib.crc32(b'IDAT' + compressed_data)
    idat_chunk = struct.pack('>I', len(compressed_data)) + b'IDAT' + compressed_data + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    with open(output_path, 'wb') as f:
        f.write(png_signature + ihdr_chunk + idat_chunk + iend_chunk)
    print(f"Created {output_path} ({width}x{height})")

def coffee_icon(x, y, w, h):
    # Normalized coordinates (-1 to 1)
    nx = (x / (w - 1)) * 2 - 1
    ny = (y / (h - 1)) * 2 - 1
    
    # Rounded squircle distance
    # Corner radius approx 22%
    r_sq = (abs(nx)**4 + abs(ny)**4)**0.25
    if r_sq > 0.96:
        # Transparent outside squircle
        return (0, 0, 0, 0)
    
    # Background: Warm luxury dark roasted coffee gradient
    t = (ny + 1) / 2
    bg_r = int(44 * (1 - t) + 20 * t)
    bg_g = int(30 * (1 - t) + 13 * t)
    bg_b = int(20 * (1 - t) + 9 * t)
    
    # Border highlight
    if 0.92 <= r_sq <= 0.95:
        return (200, 146, 87, 180)
        
    # Center distance
    dist = (nx**2 + (ny + 0.1)**2)**0.5
    
    # Outer gold halo
    if 0.58 <= dist <= 0.61:
        return (232, 191, 131, 220)
    elif 0.57 <= dist <= 0.62:
        return (200, 146, 87, 120)
        
    # Coffee Cup Geometry
    # Cup body: trapezoid near ny: -0.15 to 0.25, nx: -0.32 to 0.32
    cup_top = -0.12
    cup_bot = 0.28
    if cup_top <= ny <= cup_bot:
        progress = (ny - cup_top) / (cup_bot - cup_top)
        cup_w = 0.35 * (1 - progress * 0.28)
        if abs(nx) <= cup_w:
            # Cup inner shading (warm cream / gold gradient)
            gold_r = int(235 - progress * 40)
            gold_g = int(195 - progress * 55)
            gold_b = int(135 - progress * 60)
            return (gold_r, gold_g, gold_b, 255)
            
    # Cup handle (nx: 0.35 to 0.52, ny: -0.05 to 0.20)
    handle_cx = 0.36
    handle_cy = 0.08
    h_dist = (((nx - handle_cx)/0.14)**2 + ((ny - handle_cy)/0.13)**2)**0.5
    if 0.7 <= h_dist <= 1.05 and nx > 0.32:
        return (200, 146, 87, 255)
        
    # Cup saucer
    if 0.30 <= ny <= 0.36:
        saucer_w = 0.48 * (1 - ((ny - 0.33)/0.03)**2)**0.5 if abs((ny - 0.33)/0.03) <= 1 else 0
        if abs(nx) <= saucer_w:
            return (220, 175, 115, 255)
            
    # Steam waves (3 vertical curves at top)
    if -0.48 <= ny < -0.15:
        # Steam 1 (center)
        s1_x = 0.0 + 0.03 * ((ny + 0.3) * 15)
        # Steam 2 (left)
        s2_x = -0.15 + 0.03 * ((ny + 0.25) * 12)
        # Steam 3 (right)
        s3_x = 0.15 - 0.03 * ((ny + 0.35) * 12)
        if min(abs(nx - s1_x), abs(nx - s2_x), abs(nx - s3_x)) < 0.025:
            alpha = int(220 * (1 - abs(ny + 0.32)/0.2))
            return (232, 191, 131, max(0, min(255, alpha)))
            
    # Bottom brand accent bar
    if 0.52 <= ny <= 0.56 and abs(nx) <= 0.35:
        return (200, 146, 87, 220)
        
    return (bg_r, bg_g, bg_b, 255)

os.makedirs('public', exist_ok=True)
create_png(512, 512, coffee_icon, 'public/pwa-512x512.png')
create_png(512, 512, coffee_icon, 'public/pwa-maskable-512x512.png')
create_png(192, 192, coffee_icon, 'public/pwa-192x192.png')
create_png(180, 180, coffee_icon, 'public/apple-touch-icon.png')
create_png(64, 64, coffee_icon, 'public/favicon.ico')
print("All PWA icons generated successfully!")
