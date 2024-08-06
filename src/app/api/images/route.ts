import { getRandomNumber, sleep } from '@/utils/mock-api.util';
import { randomUUID } from 'crypto';

export type MockImage = { id: string; name: string; objectCount: number };

const generateRandomData = (): MockImage[] => {
  const length = getRandomNumber(9999, 19999);
  const data = [];

  for (let i = 0; i < length; i++) {
    const id = randomUUID();
    const name = `image_${id}`;
    const objectCount = getRandomNumber(0, 149);

    data.push({
      id,
      name,
      objectCount,
    });
  }

  return data;
};

export async function GET() {
  const delay = getRandomNumber(0, 2000);
  // 기존 코드에서는 가상의 에러 확률이 너무 높아 20%로 수정
  const shouldFail = getRandomNumber(1, 10) <= 2;

  await sleep(delay);

  if (shouldFail) return Response.error();
  return Response.json(generateRandomData());
}
