interface SortedOptions {
  key: string;
  coerce?: boolean;
  descending?: boolean;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSorted(sortedOptions: SortedOptions): CustomMatcherResult;
    }
  }
}
