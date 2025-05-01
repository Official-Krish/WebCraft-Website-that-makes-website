import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));
redisClient.connect();

export async function addNewPod(projectId: string): Promise<void> {
    try {
        await redisClient.set(
            `POD_START:${projectId}`, 
            Date.now().toString()
        );
    } catch (error) {
        console.error(`Error adding pod for project ${projectId}:`, error);
        throw error;
    }
}

export async function removePod(projectId: string): Promise<void> {
    try {
        await redisClient.del(`POD_START:${projectId}`);
    } catch (error) {
        console.error(`Error removing pod for project ${projectId}:`, error);
        throw error;
    }
}

export async function getAllPods(): Promise<Array<{projectId: string, startTime: string}>> {
    try {
        const keys = await redisClient.keys("POD_START:*");
        const pods = await Promise.all(keys.map(async (key) => {
            const value = await redisClient.get(key);
            return {
                projectId: key.split(":")[1],
                startTime: value || '0'
            };
        }));
        if (pods.length === 0) {
            console.log('No pods found');
            return [];
        }
        return pods;
    } catch (error) {
        console.error('Error getting all pods:', error);
        throw error;
    }
}