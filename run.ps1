$ErrorActionPreference = 'Stop'
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$bundledNode = 'C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
if ($null -ne $nodeCommand) {
    $nodePath = $nodeCommand.Source
} elseif (Test-Path -LiteralPath $bundledNode) {
    $nodePath = $bundledNode
} else {
    throw 'Встанови Node.js 24 або новіший, після цього повтори запуск.'
}
& $nodePath (Join-Path $PSScriptRoot 'main.ts')
exit $LASTEXITCODE
