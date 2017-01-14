from operator import itemgetter
from pprint import pprint
import json
import sys
import itertools
start = sys.argv[1]
end = sys.argv[2]

print 'Loading JSON'
bus_stops = json.loads(open('bus_stops.json', 'rb').read())
# stops = [{'service_name': x['service_name'], 'sequence': x['sequence'], 'bus_stop_id': x['bus_stop_id'], 'name_en': x['name_en']} for x in stops]
bus_stops = sorted(bus_stops, key=lambda x: (int(x['service_name']), int(x['sequence'])))


def get_name(bus_stop_id):
    for stop in bus_stops:
        if stop['bus_stop_id'] == bus_stop_id:
            return (bus_stop_id, stop['name_en'] )
    return bus_stop_id


def get_route_no_and_seq(bus_stop_id):
    for stop in bus_stops:
        if stop['bus_stop_id'] == bus_stop_id:
            return stop['service_name'], stop['sequence']
    return bus_stop_id, bus_stop_id


def get_distance(lon1, lat1, lon2, lat2):
    from math import radians, cos, sin, asin, sqrt
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon/2) ** 2
    c = 2 * asin(sqrt(a))
    km = 6367 * c
    return km

    # tx = filter(lambda x: x['bus_stop_id'] == unicode(bus_stop_id), stops)
    # if tx:
    #     return tx[0]['name_en']
    # else:
    #     return bus_stop_id



def get_id(name):
    return filter(lambda x: x['name_en'] == name, bus_stops)


print 'Initializing Graph'
graph = {}
groups = itertools.groupby(bus_stops, key=itemgetter('service_name'))
for no, stops in groups:
    stops = list(stops)
    for stop in stops[:-1]:
        current_index = stops.index(stop)
        key = stop['bus_stop_id']
        if key not in graph:
            graph[key] = {}

        current_stop = stop
        next_stop = stops[current_index + 1]
        distance = get_distance(float(current_stop['lng']), float(current_stop['lat']), float(next_stop['lng']), float(next_stop['lat']))
        assert distance >= 0, (current_stop, next_stop)

        graph[key][next_stop['bus_stop_id']] = distance


print 'Breadth First Search'
def bfs(graph, start, end):
    from Queue import Queue
    seen = set()
    queue = Queue()
    queue.put([start])

    while queue:
        path = queue.get()
        node = path[-1]
        if node == end:
            return path

        if node in seen:
            continue
        seen.add(node)

        for adjacent in graph.get(node, []):
            new_path = list(path)
            new_path.append(adjacent)
            queue.put(new_path)


# path = bfs(graph, start, end)
# print path
# pprint(map(get_name, path))

print 'Dijkstra'
def dijkstra(graph, start, end):
    import heapq
    seen = set()
    queue = []

    # put the first path into the queue
    heapq.heappush(queue, (0, [start]))
    while queue:
        (curr_distance, path) = heapq.heappop(queue)

        # get the last node from the path
        node = path[-1]
        if node == end:
            return path

        if node in seen:
            continue
        seen.add(node)

        for adjacent, distance in graph.get(node, {}).items():
            new_path = list(path)
            new_path.append(adjacent)

            heapq.heappush(queue, (curr_distance, new_path))

path = dijkstra(graph, start, end)
pprint(map(get_name, path))
