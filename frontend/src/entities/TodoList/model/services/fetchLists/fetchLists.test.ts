// fetchLists.test.ts
import { fetchLists } from './fetchLists';
import { TodoList } from '../../types/TodoList';

// Mock the api module
jest.mock('@/shared/api/api', () => ({
    $api: {
        get: jest.fn(),
    },
}));

// Import after mocking
import { $api } from '@/shared/api/api';

describe('fetchLists', () => {
    const mockTodoLists: TodoList[] = [
        {
            id: 1,
            name: 'Test List 1',
            userId: 1,
            // Add other required fields from TodoList type
        },
        {
            id: 2,
            name: 'Test List 2',
            userId: 1,
            // Add other required fields from TodoList type
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call $api.get with correct parameters', async () => {
        ($api.get as jest.Mock).mockResolvedValue({ data: mockTodoLists });

        const result = await fetchLists();

        expect($api.get).toHaveBeenCalledWith('/todos/');
        expect(result).toEqual({ data: mockTodoLists });
    });

    it('should handle errors properly', async () => {
        const error = new Error('Network error');
        ($api.get as jest.Mock).mockRejectedValue(error);

        await expect(fetchLists()).rejects.toThrow('Network error');
        expect($api.get).toHaveBeenCalledWith('/todos/');
    });
});
