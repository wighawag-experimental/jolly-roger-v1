import {derived, Readable} from 'svelte/store';
import type {
  Invalidator,
  Subscriber,
  Unsubscriber,
} from 'web3w/dist/esm/utils/internals';
import {NFTS} from '../graphql_endpoints';
import {QueryState, QueryStore, queryStore} from '../lib/graphql';

type NFTs = {
  id: string;
  name: string;
  description: string;
  image: string;
}[];

type Metadata = {image: string; description: string; name: string};

class NFTsStore implements QueryStore<NFTs> {
  private metadatas: {
    [id: string]: Metadata | 'Loading' | 'Error';
  } = {};

  private store: Readable<QueryState<NFTs>>;
  constructor(private query: QueryStore<NFTs>) {
    this.store = derived([this.query], (values) => this.update(values)); // lambda ensure update is not bound and can be hot swapped on HMR
  }

  onMetadata(id: string, metadata: Metadata) {
    // TODO use own store
    this.metadatas[id] = metadata;
  }

  update([$query]: [QueryState<NFTs>]): QueryState<NFTs> {
    if (!$query.data) {
      return $query;
    } else {
      const newData = $query.data.concat();
      return {
        state: $query.state,
        error: $query.error,
        polling: $query.polling,
        stale: $query.stale,
        data: newData, //[{id: '0x37373737373737373737373737737373', message: 'dsdsd', pending: true, timestamp: "1"}],
      };
    }
  }

  fetch(): QueryStore<NFTs> | void {
    return this.query.fetch();
  }
  cancel() {
    return this.query.cancel();
  }
  acknowledgeError() {
    return this.query.acknowledgeError();
  }

  subscribe(
    run: Subscriber<QueryState<NFTs>>,
    invalidate?: Invalidator<QueryState<NFTs>> | undefined
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }
}

const query = queryStore<NFTs>(
  NFTS,
  `
query {
  tokens(first: 100 where: {owner: "0x90f79bf6eb2c4f870365e785982e1f101e93b906"}) {
    id
    tokenURI
  }
}`,
  {
    transform: 'tokens',
    // variables: {
    //   walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'.toLowerCase(),
    // },
  } // allow to access tokens directly
);

export const nfts = new NFTsStore(query);
