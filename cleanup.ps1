$file = "C:\Users\Lesbi\vincco-digital\src\App.css"
$rawBytes = [System.IO.File]::ReadAllBytes($file)

# Detect line ending
$lineEnding = "`n"
for ($i = 0; $i -lt $rawBytes.Length - 1; $i++) {
    if ($rawBytes[$i] -eq 13 -and $rawBytes[$i + 1] -eq 10) {
        $lineEnding = "`r`n"
        break
    }
}

$content = [System.Text.Encoding]::UTF8.GetString($rawBytes)
$lines = [System.Collections.Generic.List[string]]::new($content -split "`r?`n")
Write-Host "Loaded: $($lines.Count) lines"

# ============================================
# TASK 1: Replace transition: all patterns
# ============================================

$buttonClasses = @('.cal-hoy-btn', '.cal-filtro-btn', '.cal-mes-btn', '.cal-detalle-cerrar', '.cal-evento-btn',
                    '.ntf-filtro-btn', '.panel-btn', '.panel-proveedor-fav', '.landing-user-type-btn',
                    '.dir-filtro-btn', '.dash-accion')
$cardClasses = @('.cal-evento', '.ntf-item', '.dir-card', '.mp-recompensa-card', '.panel-card',
                  '.panel-proveedor-card', '.panel-inv-item')
$navClasses = @('.cal-dia', '.panel-nav-btn')

$replaced = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^\s*transition:\s*all\b') {
        $selector = ""
        for ($j = $i - 1; $j -ge [Math]::Max(0, $i - 30); $j--) {
            if ($lines[$j] -match '^\s*\.([\w-]+)\s*\{') {
                $selector = ".$($matches[1])"
                break
            }
        }

        $indent = ""
        if ($lines[$i] -match '^(\s+)') { $indent = $matches[1] }

        $isVar = $lines[$i] -match 'var\(--transition-fast\)'

        if ($isVar) {
            if ($selector -in $buttonClasses) {
                $lines[$i] = "${indent}transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast), transform var(--transition-fast);"
            } elseif ($selector -in $cardClasses) {
                $lines[$i] = "${indent}transition: border-color var(--transition-fast), box-shadow var(--transition-fast);"
            } else {
                $lines[$i] = "${indent}transition: border-color var(--transition-fast), background var(--transition-fast), color var(--transition-fast);"
            }
        } else {
            if ($selector -in $buttonClasses) {
                $lines[$i] = "${indent}transition: color 0.2s, border-color 0.2s, background 0.2s, transform 0.15s;"
            } elseif ($selector -in $cardClasses) {
                $lines[$i] = "${indent}transition: border-color 0.2s, box-shadow 0.2s;"
            } elseif ($selector -in $navClasses) {
                $lines[$i] = "${indent}transition: border-color 0.2s, background 0.2s, color 0.2s;"
            } else {
                $lines[$i] = "${indent}transition: background 0.2s, color 0.2s, border-color 0.2s;"
            }
        }

        Write-Host "  T1 Line $($i+1): $selector"
        $replaced++
    }
}
Write-Host "Task 1: $replaced replacements"

# Verify
$remainingTA = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'transition:\s*all\b') { $remainingTA++ }
}
Write-Host "Task 1 verification: $remainingTA remaining"

# ============================================
# TASK 2: Breakpoint unification
# ============================================

Write-Host "`n--- Task 2: Breakpoints ---"

# Simple value changes (before merges, at stable line numbers)
$lines[415] = $lines[415] -replace 'max-width:\s*767px', 'max-width: 768px'
Write-Host "  Line 416: 767px -> 768px"

$lines[4086] = $lines[4086] -replace 'max-width:\s*479px', 'max-width: 480px'
Write-Host "  Line 4087: 479px -> 480px"

$lines[4347] = $lines[4347] -replace 'max-width:\s*767px', 'max-width: 768px'
Write-Host "  Line 4348: 767px -> 768px"

$lines[4354] = $lines[4354] -replace 'max-width:\s*1023px', 'max-width: 1024px'
Write-Host "  Line 4355: 1023px -> 1024px"

$lines[5138] = $lines[5138] -replace 'max-width:\s*600px', 'max-width: 480px'
Write-Host "  Line 5139: 600px -> 480px"

# ============================================
# Helper: find closing brace of a media block
# ============================================

function Find-MediaBlockEnd($linesList, $startIdx) {
    $depth = 0
    for ($i = $startIdx; $i -lt $linesList.Count; $i++) {
        $depth += ([regex]::Matches($linesList[$i], '\{')).Count
        $depth -= ([regex]::Matches($linesList[$i], '\}')).Count
        if ($depth -eq 0) { return $i }
    }
    return -1
}

# ============================================
# Merge 380px block into 480px hero block
# Insertion point (hero480End ~4345) is BEFORE block380Start (~4421)
# So block380 positions shift forward by insert count
# ============================================

Write-Host "`nMerge: 380px -> 480px hero block"

$block380Start = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^\s*@media\s*\(max-width:\s*380px\)') {
        $block380Start = $i; break
    }
}

$hero480End = -1
if ($block380Start -ge 0) {
    $block380End = Find-MediaBlockEnd $lines $block380Start
    Write-Host "  380px block: lines $($block380Start+1)-$($block380End+1)"

    # Extract rules (skip @media line and closing brace)
    $rules380 = @()
    for ($i = $block380Start + 1; $i -lt $block380End; $i++) {
        $rules380 += $lines[$i]
    }

    # Find hero 480px block (after line 4300)
    $hero480Start = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^\s*@media\s*\(max-width:\s*480px\)' -and $i -gt 4300) {
            $hero480Start = $i; break
        }
    }

    if ($hero480Start -ge 0) {
        $hero480End = Find-MediaBlockEnd $lines $hero480Start
        Write-Host "  480px hero block: lines $($hero480Start+1)-$($hero480End+1)"

        # Insert rules before closing brace (hero480End < block380Start, so block shifts)
        $insertLines = @("") + $rules380
        for ($k = 0; $k -lt $insertLines.Count; $k++) {
            $lines.Insert($hero480End + $k, $insertLines[$k])
        }

        # Remove the 380px block (shifted because insertion was BEFORE it)
        $adjusted380Start = $block380Start + $insertLines.Count
        $removeCount = $block380End - $block380Start + 1
        $lines.RemoveRange($adjusted380Start, $removeCount)
        Write-Host "  Done: inserted $($insertLines.Count) lines, removed $removeCount lines"
    }
}

# ============================================
# Merge 400px block into 480px cal block
# Insertion point (cal480End ~1048) is AFTER block400Start (~516)
# So block400 positions do NOT shift
# ============================================

Write-Host "`nMerge: 400px -> 480px cal block"

$block400Start = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^\s*@media\s*\(max-width:\s*400px\)') {
        $block400Start = $i; break
    }
}

if ($block400Start -ge 0) {
    $block400End = Find-MediaBlockEnd $lines $block400Start
    Write-Host "  400px block: lines $($block400Start+1)-$($block400End+1)"

    # Extract rules
    $rules400 = @()
    for ($i = $block400Start + 1; $i -lt $block400End; $i++) {
        $rules400 += $lines[$i]
    }

    # Find first 480px block (cal block, before line 1100)
    $cal480Start = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^\s*@media\s*\(max-width:\s*480px\)' -and $i -lt 1100) {
            $cal480Start = $i; break
        }
    }

    if ($cal480Start -ge 0) {
        $cal480End = Find-MediaBlockEnd $lines $cal480Start
        Write-Host "  480px cal block: lines $($cal480Start+1)-$($cal480End+1)"

        # Insert rules before closing brace
        # cal480End (~1048) > block400Start (~516), so block400 does NOT shift
        $insertLines = @("") + $rules400
        for ($k = 0; $k -lt $insertLines.Count; $k++) {
            $lines.Insert($cal480End + $k, $insertLines[$k])
        }

        # Remove 400px block (NO shift needed because insertion was AFTER this block)
        $removeCount = $block400End - $block400Start + 1
        $lines.RemoveRange($block400Start, $removeCount)
        Write-Host "  Done: inserted $($insertLines.Count) lines, removed $removeCount lines"
    }
}

# ============================================
# Final verification
# ============================================

Write-Host "`n=== Final Verification ==="
Write-Host "Total lines: $($lines.Count)"

# Check balanced braces
$depth = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
    $depth += ([regex]::Matches($lines[$i], '\{')).Count
    $depth -= ([regex]::Matches($lines[$i], '\}')).Count
}
if ($depth -eq 0) {
    Write-Host "Brace balance: PASS"
} else {
    Write-Warning "Brace balance: FAIL (depth=$depth)"
}

# Check for remaining transition: all
$remainingTA2 = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'transition:\s*all\b') {
        $remainingTA2++
        Write-Warning "  transition:all at line $($i+1)"
    }
}
Write-Host "Remaining 'transition: all': $remainingTA2"

# Check for old media query breakpoints only (not CSS property values)
$oldBps = @('max-width: 380px', 'max-width: 479px', 'max-width: 600px', 'max-width: 767px', 'max-width: 1023px')
$oldFound = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^\s*@media') {
        foreach ($bp in $oldBps) {
            if ($lines[$i] -match $bp) {
                Write-Warning "  Old breakpoint '$bp' at line $($i+1)"
                $oldFound++
            }
        }
    }
}
Write-Host "Old media query breakpoints: $oldFound"

# ============================================
# Save
# ============================================

$output = $lines -join $lineEnding
[System.IO.File]::WriteAllText($file, $output, [System.Text.Encoding]::UTF8)
Write-Host "`nFile saved successfully."
