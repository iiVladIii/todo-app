// updateList.test.ts
import { updateList } from './updateList';
import { TodoList } from '../../types/TodoList';

// Mock the api module
jest.mock('@/shared/api/api', () => ({
    $api: {
        put: jest.fn(),
    },
}));

// Import after mocking
import { $api } from '@/shared/api/api';

describe('updateList', () => {
    const mockTodoList: TodoList = {
        id: 1,
        name: 'Updated Test List',
        userId: 1,
        // Add other required fields from TodoList type
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call $api.put with correct parameters', async () => {
        const listId = 1;
        const title = 'Updated Test List';
        ($api.put as jest.Mock).mockResolvedValue({ data: mockTodoList });

        const result = await updateList(listId, title);

        expect($api.put).toHaveBeenCalledWith(`/todos/${listId}`, {
            name: title,
        });
        expect(result).toEqual({ data: mockTodoList });
    });

    it('should handle errors properly', async () => {
        const listId = 1;
        const title = 'Updated Test List';
        const error = new Error('Network error');
        ($api.put as jest.Mock).mockRejectedValue(error);

        await expect(updateList(listId, title)).rejects.toThrow(
            'Network error'
        );
        expect($api.put).toHaveBeenCalledWith(`/todos/${listId}`, {
            name: title,
        });
    });
});
