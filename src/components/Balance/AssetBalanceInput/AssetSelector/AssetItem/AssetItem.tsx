import { Asset } from '../../../../../generated/graphql';
import classNames from 'classnames';
export interface AssetItemProps {
    asset: Asset,
    onClick: () => void,
    active: boolean
}

export const AssetItem = ({
    asset,
    onClick,
    active
}: AssetItemProps) => (
    <div
        className={'asset-selector__asset-item ' + classNames({
            'active': active
        })} 
        onClick={onClick}>
        {asset.id}
    </div>
)