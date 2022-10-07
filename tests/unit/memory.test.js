const FragmentDB = require('../../src/model/data/memory/index')

describe('data/memory/index', () => {

    test('readFragment(ownerId, id) returns writeFragment(fragment) data', async () => {
        const fragment = { ownerId: 'a', id: 'b', size: 256, type: 'text/plain', created: 'e', updated: 'f' };
        FragmentDB.writeFragment(fragment)
        const result = await FragmentDB.readFragment('a', 'b')
        expect(result).toEqual(fragment);
    });

    test('readFragmentData(ownerId, id) returns writeFragmentData(ownerId, id, value) data', async () => {
        const data = Buffer.from([3, 4, 5]);
        FragmentDB.writeFragmentData('a','b', data);
        const result = await FragmentDB.readFragmentData('a', 'b')
        expect(result).toEqual(data);
    });

    test('readFragment(ownerId, id) with incorrect keys returns nothing', async () => {
        const result = await FragmentDB.readFragment('a', 'c')
        expect(result).toBe(undefined);
    });

    test('readFragmentData(ownerId, id) with incorrect keys returns nothing', async () => {
        const result = await FragmentDB.readFragmentData('a', 'c')
        expect(result).toBe(undefined);
    });

    test('listFragments(ownerId, expand=false) - just return IDs', async () => {
        const fragment = { ownerId: 'a', id: 'a', value: 1 };
        const fragment2 = { ownerId: 'a', id: 'c', value: 2 };
        const fragment3 = { ownerId: 'a', id: 'd', value: 3 };
        await FragmentDB.writeFragment(fragment);
        await FragmentDB.writeFragment(fragment2);
        await FragmentDB.writeFragment(fragment3);
        const results = await FragmentDB.listFragments('a')
        expect(Array.isArray(results)).toBe(true);
        expect(results).toEqual(['b', 'a', 'c', 'd']);
      });

      test('listFragments(ownerId, expand=true) - return entire fragment', async () => {
        const fragment = { ownerId: 'b', id: 'a', value: 1 };
        await FragmentDB.writeFragment(fragment);
        const results = await FragmentDB.listFragments('b', true)
        expect(Array.isArray(results)).toBe(true);
        expect(results).toEqual([{ ownerId: 'b', id: 'a', value: 1 }]);
      });

      test('listFragments(z) - should return an empty array', async () => {
        const results = await FragmentDB.listFragments('z')
        expect(Array.isArray(results)).toBe(true);
        expect(results).toEqual([]);
      });

      test('del() removes value put() into db', async () => {
        await FragmentDB.deleteFragment('a', 'b');
        expect(await FragmentDB.readFragment('a', 'b')).toBe(undefined);
        expect(await FragmentDB.readFragmentData('a', 'b')).toBe(undefined);
  });   
});