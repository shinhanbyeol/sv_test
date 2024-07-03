import { getRandomNumber, sleep } from '@/utils/mock-api.util';
import { randomUUID } from 'crypto';

export type MockUser = { id: string; name: string; email: string };

const generateRandomData = (): MockUser[] => {
  const length = getRandomNumber(5, 333);
  const data = [];

  for (let i = 0; i < length; i++) {
    const id = randomUUID();
    const name = `user_${i}`;
    const email = `
      ${name}
      @
      example.com
    `.replace(/\s/g, '');

    data.push({
      id,
      name,
      email,
    });
  }

  return data;
};

export async function GET() {
  const delay = getRandomNumber(0, 2000);
  const shouldFail = getRandomNumber(1, 10) <= 10;

  await sleep(delay);

  if (shouldFail) return Response.error();
  return Response.json(generateRandomData());
}
