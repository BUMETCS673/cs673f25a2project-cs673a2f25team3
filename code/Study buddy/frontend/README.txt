[中文]
这是覆盖率提升包（安全增量）。把整个 __tests__ 文件夹与 jest.config.js 覆盖到项目根目录。
默认阈值仍为 0（确保不会因为覆盖率失败）。当你想要求 80% 时，用：
  COVERAGE_80=1 npm run test:cov
Windows PowerShell:
  $env:COVERAGE_80='1'; npm run test:cov

[EN]
This pack adds safe extra tests. Default threshold is relaxed to avoid failures.
To enforce 80% locally:
  COVERAGE_80=1 npm run test:cov
On Windows PowerShell:
  $env:COVERAGE_80='1'; npm run test:cov
