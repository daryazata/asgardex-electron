import React, { useCallback, useMemo, useState } from 'react'

import { SearchOutlined } from '@ant-design/icons/lib'
import * as A from 'fp-ts/Array'
import * as FP from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { useIntl } from 'react-intl'

import { emptyString } from '../../helpers/stringHelper'
import { isStaticPoolFilter, PoolFilter, PoolFilters, StaticPoolFilter } from '../../services/midgard/types'
import * as Styled from './AssetsFilter.styles'

type Props = {
  className?: string
  poolFilters: PoolFilters
  activeFilter: O.Option<PoolFilter>
  setFilter: (filter: O.Option<PoolFilter>) => void
}

export const AssetsFilter: React.FC<Props> = ({ poolFilters, className, activeFilter: oActiveFilter, setFilter }) => {
  const intl = useIntl()

  const filterNames: Record<StaticPoolFilter, string> = useMemo(
    () => ({
      __watched__: 'star', // will be replaced by an icon, but don't leave it empty
      __base__: intl.formatMessage({ id: 'common.asset.base' }),
      __usd__: 'usd',
      __erc20__: 'erc20',
      __bep2__: 'bep2'
    }),
    [intl]
  )

  const [inputValue, setInputValue] = useState(emptyString)

  const setCustomFilter = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      const filter = target.value
      setInputValue(filter)
      // Use non-empty strings only
      setFilter(O.fromPredicate((v) => !!v)(filter))
    },
    [setFilter]
  )

  const buttonClickHandler = useCallback(
    (filter: StaticPoolFilter) => {
      FP.pipe(
        oActiveFilter,
        O.fold(
          () => setFilter(O.some(filter)),
          (activeFilter) => {
            if (filter === activeFilter) setFilter(O.none)
            else setFilter(O.some(filter))
          }
        )
      )
      // empty search input
      setInputValue(emptyString)
    },
    [oActiveFilter, setFilter]
  )

  return FP.pipe(
    poolFilters,
    A.map((filter) => {
      const isActive = FP.pipe(
        oActiveFilter,
        O.map(
          (active) =>
            active === filter &&
            // don't update if an user has typed something into search field
            !inputValue
        ),
        O.getOrElse(() => false)
      )

      const filterLabel = isStaticPoolFilter(filter) && filterNames[filter]

      return (
        filterLabel && (
          <Styled.FilterButton
            focused={isActive}
            active={isActive ? 'true' : 'false'}
            weight={isActive ? 'bold' : 'normal'}
            onClick={() => buttonClickHandler(filter)}
            key={filter}>
            {filter !== '__watched__' ? filterLabel : <Styled.Star />}
          </Styled.FilterButton>
        )
      )
    }),
    O.fromPredicate((children) => children.length > 0),
    O.map((filters) => (
      <Styled.Container key="container" className={className}>
        {filters}
        <Styled.Input
          prefix={<SearchOutlined />}
          onChange={setCustomFilter}
          value={inputValue}
          allowClear
          placeholder={intl.formatMessage({ id: 'common.search' }).toUpperCase()}
          size="large"
        />
      </Styled.Container>
    )),
    O.toNullable
  )
}
