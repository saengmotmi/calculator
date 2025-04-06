import { testCases, debug } from "./debug";

// 명령줄 인수 가져오기
// Note: TypeScript가 process를 인식하지 못할 수 있지만, Node.js 환경에서는 작동함
// @ts-ignore
const args = process.argv.slice(2);
const testIndex = args.length > 0 ? parseInt(args[0]) : -1;

// 특정 테스트 또는 모든 테스트 실행
if (testIndex >= 0 && testIndex < testCases.length) {
  console.log(`테스트 ${testIndex} 실행 중...`);
  debug(testCases[testIndex]);
} else {
  // 모든 테스트 실행
  testCases.forEach((testCase, index) => {
    console.log(`\n테스트 ${index} 실행 중...`);
    debug(testCase);
  });
}
