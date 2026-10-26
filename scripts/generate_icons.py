import struct
import zlib
import os
import math

def create_png(width, height, draw_fn, output_path):
    png_signature = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    ihdr_chunk = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)
        for x in range(width):
            r, g, b, a = draw_fn(x, y, width, height)
            raw_data.extend([r, g, b, a])
            
    compressed_data = zlib.compress(bytes(raw_data), level=9)
    idat_crc = zlib.crc32(b'IDAT' + compressed_data)
    idat_chunk = struct.pack('>I', len(compressed_data)) + b'IDAT' + compressed_data + struct.pack('>I', idat_crc)
    
    iend_crc = zlib.crc32(b'IEND')
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    with open(output_path, 'wb') as f:
        f.write(png_signature + ihdr_chunk + idat_chunk + iend_chunk)
    print(f"Created {output_path} ({width}x{height})")

def clamp(val, low=0, high=255):
    return max(low, min(high, int(val)))

def apple_coffee_icon(x, y, w, h, is_apple=True):
    nx = (x / (w - 1)) * 2 - 1
    ny = (y / (h - 1)) * 2 - 1
    
    # Non-Apple icons can have rounded outer squircle if needed,
    # but Apple Touch Icons MUST BE 100% OPAQUE FULL BLEED
    if not is_apple:
        r_sq = (abs(nx)**4.2 + abs(ny)**4.2)**0.238
        if r_sq > 0.98:
            return (0, 0, 0, 0)
            
    # Base radial + linear dark roasted coffee gradient
    # Apple luxury style: warm dark chocolate / rich coffee beans
    diag = (nx + ny) / 2.8
    r_center = math.sqrt(nx**2 + (ny - 0.05)**2)
    
    # Warm spotlight from top left
    spotlight = max(0, 1.0 - math.sqrt((nx + 0.3)**2 + (ny + 0.4)**2) / 1.6)
    
    bg_r = clamp(32 + 25 * spotlight - 10 * diag)
    bg_g = clamp(22 + 18 * spotlight - 8 * diag)
    bg_b = clamp(16 + 12 * spotlight - 6 * diag)
    
    # Gold decorative inner circle (radius ~0.78)
    if 0.77 <= r_center <= 0.795:
        alpha = 0.55 + 0.4 * spotlight
        gold_r = clamp(232 * alpha + bg_r * (1 - alpha))
        gold_g = clamp(191 * alpha + bg_g * (1 - alpha))
        gold_b = clamp(131 * alpha + bg_b * (1 - alpha))
        return (gold_r, gold_g, gold_b, 255)
        
    # Subtle secondary thin ring
    if 0.73 <= r_center <= 0.74:
        return (180, 135, 80, 160 if not is_apple else 255)

    # COFFEE CUP WITH LATTE ART (Centered at 0.0, -0.05)
    cup_cx = 0.0
    cup_cy = -0.08
    dx = nx - cup_cx
    dy = (ny - cup_cy) * 1.08
    dist_cup = math.sqrt(dx**2 + dy**2)
    
    # Cup handle (on right side: dx 0.38 to 0.58, dy -0.1 to 0.15)
    h_dx = dx - 0.40
    h_dy = dy - 0.02
    h_rad = math.sqrt((h_dx / 0.16)**2 + (h_dy / 0.14)**2)
    if 0.68 <= h_rad <= 1.08 and dx > 0.32:
        # Gold porcelain handle with 3D bevel
        h_shade = 0.8 + 0.3 * (1.0 - h_rad)
        return (clamp(220 * h_shade), clamp(175 * h_shade), clamp(120 * h_shade), 255)

    # Outer porcelain cup rim (radius 0.42 to 0.46)
    if 0.40 <= dist_cup <= 0.45:
        # Cream porcelain rim highlight
        angle = math.atan2(dy, dx)
        rim_light = (math.cos(angle - 2.4) + 1) / 2
        p_r = clamp(245 * rim_light + 200 * (1 - rim_light))
        p_g = clamp(238 * rim_light + 185 * (1 - rim_light))
        p_b = clamp(225 * rim_light + 165 * (1 - rim_light))
        return (p_r, p_g, p_b, 255)

    # Inner cup rim shadow
    if 0.38 <= dist_cup < 0.40:
        return (55, 34, 20, 255)

    # Coffee liquid surface (Crema) (radius < 0.38)
    if dist_cup < 0.38:
        # Rich caramel crema gradient
        crema_t = dist_cup / 0.38
        # Deep espresso near rim, golden crema in center
        cr_r = clamp(190 * (1 - crema_t * 0.45) + 60 * crema_t)
        cr_g = clamp(130 * (1 - crema_t * 0.55) + 38 * crema_t)
        cr_b = clamp(75 * (1 - crema_t * 0.65) + 20 * crema_t)
        
        # Latte Art Heart (math curve: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0)
        # Scaled to center of cup
        lx = dx / 0.22
        ly = -(dy - 0.04) / 0.22
        
        # Heart formula
        heart_val = (lx**2 + ly**2 - 0.7)**3 - (lx**2) * (ly**3)
        if heart_val <= 0.02:
            # Silky milk froth (warm ivory white / velvet microfoam)
            froth_edge = max(0, min(1, (0.02 - heart_val) / 0.05))
            f_r = clamp(255 * froth_edge + cr_r * (1 - froth_edge))
            f_g = clamp(248 * froth_edge + cr_g * (1 - froth_edge))
            f_b = clamp(238 * froth_edge + cr_b * (1 - froth_edge))
            return (f_r, f_g, f_b, 255)
            
        return (cr_r, cr_g, cr_b, 255)

    # STEAM WAVES ABOVE CUP (ny from -0.65 to -0.42)
    if -0.62 <= ny <= -0.42 and abs(nx) <= 0.30:
        wave1 = math.sin((ny + 0.5) * 22) * 0.035
        wave2 = math.sin((ny + 0.45) * 18) * 0.04 - 0.12
        wave3 = math.sin((ny + 0.55) * 18) * 0.04 + 0.12
        d1 = abs(nx - wave1)
        d2 = abs(nx - wave2)
        d3 = abs(nx - wave3)
        min_d = min(d1, d2, d3)
        if min_d < 0.022:
            alpha = (1.0 - min_d / 0.022) * (1.0 - abs(ny + 0.52) / 0.12)
            alpha = max(0.0, min(0.7, alpha))
            return (clamp(240 * alpha + bg_r * (1 - alpha)),
                    clamp(200 * alpha + bg_g * (1 - alpha)),
                    clamp(150 * alpha + bg_b * (1 - alpha)), 255)

    # "NAZ COFFEE" TEXT EMBLEM AREA (ny: 0.44 to 0.76)
    # Elegant gold emblem bar
    if 0.48 <= ny <= 0.50 and abs(nx) <= 0.38:
        return (215, 168, 105, 255)
        
    # Lettering bitmap approximation for "NAZ" (nx -0.26 to 0.26, ny 0.54 to 0.68)
    # N (nx: -0.22 to -0.10, ny: 0.54 to 0.68)
    is_text = False
    if 0.54 <= ny <= 0.68:
        # Letter N
        if -0.22 <= nx <= -0.20 or -0.12 <= nx <= -0.10:
            is_text = True
        diag_n = (nx - (-0.22)) / 0.10
        if 0 <= diag_n <= 1 and abs((ny - 0.54) / 0.14 - diag_n) < 0.16:
            is_text = True
            
        # Letter A (nx: -0.06 to 0.06)
        a_prog = (ny - 0.54) / 0.14
        left_a = -0.06 * a_prog
        right_a = 0.06 * a_prog
        if abs(nx - left_a) < 0.015 or abs(nx - right_a) < 0.015:
            is_text = True
        if 0.62 <= ny <= 0.64 and left_a <= nx <= right_a:
            is_text = True
            
        # Letter Z (nx: 0.10 to 0.22)
        if (0.10 <= nx <= 0.22 and (0.54 <= ny <= 0.56 or 0.66 <= ny <= 0.68)):
            is_text = True
        z_diag = 1.0 - (nx - 0.10) / 0.12
        if 0 <= z_diag <= 1 and abs((ny - 0.54) / 0.14 - z_diag) < 0.16:
            is_text = True

    if is_text:
        return (248, 225, 185, 255)
        
    # Sub-caption dot accents (ny: 0.72)
    if 0.72 <= ny <= 0.735 and (abs(nx - (-0.15)) < 0.012 or abs(nx) < 0.012 or abs(nx - 0.15) < 0.012):
        return (215, 168, 105, 255)

    return (bg_r, bg_g, bg_b, 255)

def apple_icon_fn(x, y, w, h):
    return apple_coffee_icon(x, y, w, h, is_apple=True)

def pwa_icon_fn(x, y, w, h):
    return apple_coffee_icon(x, y, w, h, is_apple=False)

os.makedirs('public', exist_ok=True)
os.makedirs('public/images', exist_ok=True)

# Apple Touch Icon: MUST BE FULL BLEED 100% OPAQUE (180x180)
create_png(180, 180, apple_icon_fn, 'public/apple-touch-icon.png')
create_png(180, 180, apple_icon_fn, 'public/apple-touch-icon-precomposed.png')

# Also save high-res version for preview and download
create_png(512, 512, apple_icon_fn, 'public/apple-touch-icon-512x512.png')
create_png(512, 512, apple_icon_fn, 'public/images/apple_icon_preview.png')

# PWA icons
create_png(512, 512, apple_icon_fn, 'public/pwa-maskable-512x512.png')
create_png(512, 512, pwa_icon_fn, 'public/pwa-512x512.png')
create_png(192, 192, pwa_icon_fn, 'public/pwa-192x192.png')
create_png(64, 64, pwa_icon_fn, 'public/favicon.ico')

print("All Apple and PWA icons generated successfully!")
