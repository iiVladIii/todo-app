```shell
create namespaces monitorin todo-app-deploy
```
## apply configs
## apply deployments
## apply services
```shell
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```
```shell
kubectl apply -f metrics-server-fixed.yaml
```
```shell
kubectl -n kube-system rollout status deployment metrics-server
```
```shell
kubectl apply -f https://openebs.github.io/charts/openebs-operator.yaml
kubectl get pods -n openebs
kubectl apply -f sc/openebs-hostpath-storageclass.yaml
kubectl get sc

kubectl get pv
kubectl get pvc -n monitoring
```
```shell
helm install prometheus prometheus-community/prometheus --namespace monitoring
```

## apply pvc
```shell
helm install grafana grafana/grafana --namespace monitoring
```
```shell
kubectl port-forward service/grafana 3003:80 -n monitoring
kubectl port-forward service/prometheus-server 3004:80 -n monitoring
```
```shell
kubectl get secret --namespace monitoring grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```

## update and apply config 
```shell
kubectl get configmap prometheus-server -n monitoring -o yaml > prometheus-config-latest.yaml
```
