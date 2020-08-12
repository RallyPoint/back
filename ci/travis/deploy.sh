#!/bin/bash

echo "--------------"
echo $KUBE_NAMESPACE
echo "--------------"

function deploy_name() {
    name="$CI_ENVIRONMENT_SLUG"
    track="${1-stable}"

    if [[ "$track" != "stable" ]]; then
      name="$name-$track"
    fi

    echo $name
}


track="${1-stable}"
name=$(deploy_name "$track")
echo "KUBE_NAMESPACE: $KUBE_NAMESPACE";

pwd

helm upgrade --install \
  --wait \
  --set env.NODE_ENV="$KUBE_NAMESPACE" \
  --set ENV_CONFIG="$KUBE_NAMESPACE" \
  --set image.tag="$TRAVIS_COMMIT" \
  --namespace="$KUBE_NAMESPACE" \
  --create-namespace \
  "$name" \
  ci/chart/


echo "END"
