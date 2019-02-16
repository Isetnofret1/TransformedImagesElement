﻿import * as React from "react";

import { ContentManagementClient } from "kentico-cloud-content-management";
import { AssetModels } from "kentico-cloud-content-management/_bundles/models/assets/asset.models";

import { IElement } from "./kentico/IElement";
import { IContext } from "./kentico/IContext";

import { AssetThumbnail } from "./AssetThumbnail";

export interface IElementProps {
    element: IElement;
    context: IContext;
}

export interface IElementState {
    originalAssets: AssetModels.Asset[];
}

// Expose access to Kentico custom element API
declare const CustomElement: any;

export class AdvancedAssetElement extends React.Component<IElementProps, IElementState> {
    state: IElementState = {
        originalAssets: []
    };

    client = new ContentManagementClient({
        projectId: this.props.context.projectId,
        apiKey: this.props.element.config.contentManagementAPIKey
    });

    componentWillMount() {
        const _this = this;

        _this.client.listAssets()
            .toObservable()
            .subscribe(response =>
                _this.filterAssetResponse(response.data.items)
            );
    }

    filterAssetResponse = (items: AssetModels.Asset[]) => {
        this.setState({
            originalAssets: items
                .filter(i => i.imageWidth !== null)
        });
    }

    render() {
        return (
            <div>
                <div className="assetThumbnailList">
                    {this.state.originalAssets.map((a, i) => (
                        <AssetThumbnail asset={a} key={i} context={this.props.context} />
                    )
                    )}
                </div>
            </div>
        );
    }
}