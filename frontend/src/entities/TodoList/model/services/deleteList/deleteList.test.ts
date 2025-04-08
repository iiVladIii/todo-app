// deleteList.test.ts
import { deleteList } from './deleteList';

// Mock the api module
jest.mock('@/shared/api/api', () => ({
    $api: {
        delete: jest.fn(),
    },
}));

// Import after mocking
import { $api } from '@/shared/api/api';

describe('deleteList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call $api.delete with correct parameters', async () => {
        const listId = 1;
        ($api.delete as jest.Mock).mockResolvedValue({ data: {} });

        const result = await deleteList(listId);

        expect($api.delete).toHaveBeenCalledWith(`/todos/${listId}`);
        expect(result).toEqual({ data: {} });
    });

    it('should handle errors properly', async () => {
        const listId = 1;
        const error = new Error('Network error');
        ($api.delete as jest.Mock).mockRejectedValue(error);

        await expect(deleteList(listId)).rejects.toThrow('Network error');
        expect($api.delete).toHaveBeenCalledWith(`/todos/${listId}`);
    });
});
