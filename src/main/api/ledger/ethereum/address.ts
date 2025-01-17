import EthApp from '@ledgerhq/hw-app-eth'
import type Transport from '@ledgerhq/hw-transport'
import { ETHChain } from '@xchainjs/xchain-util'
import * as E from 'fp-ts/Either'

import { LedgerError, LedgerErrorId } from '../../../../shared/api/types'
import { getDerivationPath } from '../../../../shared/ethereum/ledger'
import { EthHDMode } from '../../../../shared/ethereum/types'
import { isError } from '../../../../shared/utils/guard'
import { WalletAddress } from '../../../../shared/wallet/types'

export const getAddress = async ({
  transport,
  walletIndex,
  ethHdMode
}: {
  transport: Transport
  walletIndex: number
  ethHdMode: EthHDMode
}): Promise<E.Either<LedgerError, WalletAddress>> => {
  try {
    const app = new EthApp(transport)
    const path = getDerivationPath(walletIndex, ethHdMode)
    const { address } = await app.getAddress(path)

    if (address) {
      return E.right({ address, chain: ETHChain, type: 'ledger', walletIndex, hdMode: ethHdMode })
    } else {
      return E.left({
        errorId: LedgerErrorId.INVALID_PUBKEY,
        msg: `Could not get address from Ledger's Ethereum App`
      })
    }
  } catch (error) {
    return E.left({
      errorId: LedgerErrorId.GET_ADDRESS_FAILED,
      msg: isError(error) ? error?.message ?? error.toString() : `${error}`
    })
  }
}

export const verifyAddress = async ({
  transport,
  walletIndex,
  ethHdMode
}: {
  transport: Transport
  walletIndex: number
  ethHdMode: EthHDMode
}) => {
  const app = new EthApp(transport)
  const path = getDerivationPath(walletIndex, ethHdMode)
  const _ = await app.getAddress(path, true)
  return true
}
