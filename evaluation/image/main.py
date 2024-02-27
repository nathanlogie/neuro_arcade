from volume import evaluation

if __name__ == '__main__':
    with open('volume/input.txt', 'r') as f:
        data = f.read()

    output = evaluation.evaluation(data)

    print(output)
