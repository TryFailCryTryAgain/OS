



function twoSum(nums: number[], target: number): number[] {

    const sorted = nums
        .map((value, index) => ({ value, index }))
        .sort((a, b) => a.value - b.value);

    let curr = 0;
    let next = sorted.length - 1;

    while (curr < next) {
        const sum = sorted[curr].value + sorted[next].value;
        if (sum === target) {
            return [sorted[curr].index, sorted[next].index];
        } else if (sum > target) {
            next--;
        } else {
            curr++;
        }
    }

    return [];


}


const Test = twoSum([1, 2, 3], 3);
console.log(Test);