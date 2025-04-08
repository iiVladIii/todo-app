// createList.test.ts
import { createList } from './createList';
import { TodoList } from '../../types/TodoList';

// Mock the api module
jest.mock('@/shared/api/api', () => ({
    $api: {
        post: jest.fn(),
    },
}));

// Import after mocking
import { $api } from '@/shared/api/api';

describe('createList', () => {
    const mockTodoList: TodoList = {
        id: 1,
        name: 'Test List',
        userId: 0,
        // Add other required fields from TodoList type
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call $api.post with correct parameters', async () => {
        const title = 'New Todo List';
        ($api.post as jest.Mock).mockResolvedValue({ data: mockTodoList });

        const result = await createList(title);

        expect($api.post).toHaveBeenCalledWith('/todos/', { name: title });
        expect(result).toEqual({ data: mockTodoList });
    });

    it('should handle errors properly', async () => {
        const title = 'New Todo List';
        const error = new Error('Network error');
        ($api.post as jest.Mock).mockRejectedValue(error);

        await expect(createList(title)).rejects.toThrow('Network error');
        expect($api.post).toHaveBeenCalledWith('/todos/', { name: title });
    });
});
